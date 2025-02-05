import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import { IMinimaUserIdentifier } from "./verifyMagicLink";

import User from "../../model/User";
import { Encryptor } from "../../utility/encrypt";
import { ParameterParser } from "../../utility/verifyParameters";
import { Error401, triErrorHandler } from "../../utility/errorHandler";

export async function verifyUserAccess(req: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const data = ParameterParser.parseUrl(req, "data").verifyParameter("URL");
    const secretKey = ParameterParser.parseEnv(
      process.env.COOKIES_ENCRYPTION_KEY
    ).verifyParameter("JWTTOKEN");
    const secretEncryptionKey = ParameterParser.parseEnv(
      process.env.ENCRYPTION_KEY
    ).verifyParameter("ENCRYPTIONKEY");
    const decodedData = decodeURIComponent(data);

    // verify jwt
    try {
      jwt.verify(decodedData, secretKey);
    } catch (error) {
      throw new Error401("Invalid JWT" + error);
    }

    //decrypt jwt payload
    interface IJwtPayload {
      exp: number;
      data: string;
    }
    const jwtPayload = jwt.decode(decodedData) as unknown as IJwtPayload;
    const encryptedData = jwtPayload.data;
    const decrypted = new Encryptor<IMinimaUserIdentifier>(
      secretEncryptionKey
    ).decrypt(encryptedData);
    const email = decrypted.email;
    const customerid = decrypted.customerid;

    // Create a new User instance
    const user = new User(email, customerid);

    // Check if the user has accessed the form before
    if (await user.hasUserAccessForm()) {
      return NextResponse.json(
        {
          message: "User has accessed form.",
          email: email,
          customerid: customerid,
        },
        { status: 403 }
      );
    } else {
      // Mark the user as having accessed the form
      await user.makeUserAccessForm();
      return NextResponse.json(
        {
          message: "User is new.",
          email: email,
          customerid: customerid,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    return triErrorHandler(error);
  }
}
