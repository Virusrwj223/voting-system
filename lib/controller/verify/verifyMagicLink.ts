import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { IUserIdentifier } from "../email/emailMagicLink";

import Token from "../../model/Token"; // Update the import path accordingly
import { Encryptor } from "../../utility/encrypt";
import { triErrorHandler } from "../../utility/errorHandler";
import { ParameterParser } from "../../utility/verifyParameters";

// payload to be sent to client
export interface IMinimaUserIdentifier {
  email: string;
  customerid: string;
}

export async function verifyMagicLink(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const data = ParameterParser.parseUrl(req, "data").verifyParameter("URL");
    const secretKey = ParameterParser.parseEnv(
      process.env.COOKIES_ENCRYPTION_KEY
    ).verifyParameter("JWTTOKEN");
    const secretEncryptionKey = ParameterParser.parseEnv(
      process.env.ENCRYPTION_KEY
    ).verifyParameter("ENCRYPTIONKEY");

    // Decrypt data
    const decodedData = decodeURIComponent(data);
    const decrypted = new Encryptor<IUserIdentifier>(
      secretEncryptionKey
    ).decrypt(decodedData);
    const token = decrypted.token;
    const customerid = decrypted.customerid;
    const email = decrypted.email;

    // Validate the token integrity
    const tokenObj = await Token.of(token);
    await tokenObj.checkTokenIntegrity(email);

    //encrypt data to be sent
    const payload: IMinimaUserIdentifier = {
      email: email,
      customerid: customerid.toString(),
    };
    const encryptedData = new Encryptor<IMinimaUserIdentifier>(
      secretEncryptionKey
    ).encrypt(payload);

    //Authenticate data to be sent
    const jwtToken = jwt.sign({ data: encryptedData }, secretKey, {
      expiresIn: "1h",
    });

    // Redirect to frontend dashboard with email and customer ID
    const redirectUrl = `${
      process.env.BASE_URL || "http://localhost:3000"
    }/client/dashboard?data=${encodeURIComponent(jwtToken)}`;

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    return triErrorHandler(error);
  }
}
