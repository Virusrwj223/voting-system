"use server";

import { NextRequest } from "next/server";
import { verifyMagicLink } from "../../../../../lib/controller/verify/verifyMagicLink";

export async function GET(req: NextRequest) {
  return await verifyMagicLink(req);
}
