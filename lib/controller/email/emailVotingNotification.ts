import { NextRequest } from "next/server";
import dotenv from "dotenv";

import { Gmail } from "../../model/Email";
import NotificationToken from "../../model/NotificationToken";
import User from "../../model/User";
import { ParameterParser } from "../../utility/verifyParameters";
import { Success200, triErrorHandler } from "../../utility/errorHandler";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

export const emailVotingNotification = async (req: NextRequest) => {
  try {
    // Parse the request body
    interface RequestBody {
      email: string | undefined;
      customerid: string | undefined;
    }
    let { email, customerid }: RequestBody = await req.json();
    email =
      ParameterParser.parsePayload(email).verifyParameter("RECEIVEREMAIL");
    customerid =
      ParameterParser.parsePayload(customerid).verifyParameter("RECEIVERID");
    const senderEmail = ParameterParser.parseEnv(
      process.env.EMAIL_USER
    ).verifyParameter("SENDEREMAIL");
    const password = ParameterParser.parseEnv(
      process.env.EMAIL_PASS
    ).verifyParameter("SENDERPASSWORD");
    const token = NotificationToken.generateToken();
    const expiration = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 2 days

    const user = new User(email, customerid);
    // Save user to the database
    await user.saveUser();
    // reset user form access
    await user.resetFormAccess();

    // Save token with expiration
    await token.saveToken(email, expiration);

    // Generate magic link
    const notificationLink = `${
      process.env.BASE_URL || "http://localhost:3000"
    }/server/email/email-magic-link?notificationtoken=${token.toString()}`;

    // Send email
    await new Gmail(senderEmail, password).sendMail(
      [email],
      "You are eligible to vote",
      `
            <p>Click here to authenticate vote. Magic voting link will expire in 1 minute after being sent.</p>
            <a href="${notificationLink}" 
               style="display: inline-block; 
                      padding: 12px 20px; 
                      color: white; 
                      background-color: #d9534f; 
                      text-decoration: none; 
                      border-radius: 5px; 
                      font-size: 16px; 
                      font-family: Arial, sans-serif; 
                      text-align: center;">
                SEND MAGIC VOTING LINK
            </a>
          `
    );

    return new Success200("Magic link sent to your email.").returnSuccess();
  } catch (error) {
    return triErrorHandler(error);
  }
};
