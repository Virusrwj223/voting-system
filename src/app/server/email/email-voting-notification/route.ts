"use server";

import { NextRequest } from "next/server";
import { emailVotingNotification } from "../../../../../lib/controller/email/emailVotingNotification";

export async function POST(req: NextRequest) {
  return await emailVotingNotification(req);
}
