import { NextRequest, NextResponse } from "next/server";
import dotenv from "dotenv";

import Token from "../../model/Token";
import { Gmail } from "../../model/Email";
import { Encryptor } from "../../utility/encrypt";
import { triErrorHandler } from "../../utility/errorHandler";
import { ParameterParser } from "../../utility/verifyParameters";
import NotificationToken from "../../model/NotificationToken";

const env = process.env.NODE_ENV || "development";
dotenv.config({ path: `.env.${env}` });

// payload to be sent to client
export interface IUserIdentifier {
  token: string;
  email: string;
  customerid: string;
}

export async function emailMagicLink(req: NextRequest) {
  try {
    // Extract query parameters
    const notificationtoken = ParameterParser.parseUrl(
      req,
      "notificationtoken"
    ).verifyParameter("NOTIFICATIONTOKEN");
    const senderEmail = ParameterParser.parseEnv(
      process.env.EMAIL_USER
    ).verifyParameter("SENDEREMAIL");
    const password = ParameterParser.parseEnv(
      process.env.EMAIL_PASS
    ).verifyParameter("SENDERPASSWORD");
    const secretEncryptionKey = ParameterParser.parseEnv(
      process.env.ENCRYPTION_KEY
    ).verifyParameter("ENCRYPTIONKEY");

    // Get user based on the notification token
    const notificationTokenObj = await NotificationToken.of(notificationtoken);
    const user = await notificationTokenObj.getUser();
    const email = user.email;
    const customerid = user.customerid;

    // Invalidate the token after use
    await notificationTokenObj.invalidateToken();

    // Generate a token and expiration time
    const token = Token.generateToken();
    const expiration = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2h

    // Save the token to the database
    await token.saveToken(email, expiration);

    const payload: IUserIdentifier = {
      token: token.toString(),
      email: email,
      customerid: customerid.toString(),
    };

    // Generate the magic link
    const magicLink = `${
      process.env.BASE_URL
    }/server/verify/verify-magic-link?data=${encodeURIComponent(
      new Encryptor<IUserIdentifier>(secretEncryptionKey).encrypt(payload)
    )}`;

    // Send the email
    await new Gmail(senderEmail, password).sendMail(
      [email],
      "Your Magic Login Link",
      `
      <p>Click and confirm that you want to vote. Voting link will expire in 1 minute.</p>
      <a href="${magicLink}" 
         style="display: inline-block; 
                padding: 12px 20px; 
                color: white; 
                background-color: #d9534f; 
                text-decoration: none; 
                border-radius: 5px; 
                font-size: 16px; 
                font-family: Arial, sans-serif; 
                text-align: center;">
          ACCESS VOTE
      </a>
      `
    );

    // Redirect to the frontend's confirmation page
    const redirectUrl = `${
      process.env.BASE_URL || "http://localhost:3000"
    }/client/emailsent`;
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return triErrorHandler(error);
  }
}
