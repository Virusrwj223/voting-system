"use server";

import { NextRequest } from "next/server";
import { emailMagicLink } from "../../../../../lib/controller/email/emailMagicLink";

export async function GET(req: NextRequest) {
  return await emailMagicLink(req);
}
