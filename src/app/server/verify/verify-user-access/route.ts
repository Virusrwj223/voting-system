"use server";

import { NextRequest } from "next/server";
import { verifyUserAccess } from "../../../../../lib/controller/verify/verifyUserAccess";

export async function GET(req: NextRequest) {
  return await verifyUserAccess(req);
}
