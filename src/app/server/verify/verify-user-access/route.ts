'use server';

import { NextRequest } from 'next/server';

import { verifyUserAccess } from '@/controller/verify/verifyUserAccess';

export async function GET(req: NextRequest) {
  return await verifyUserAccess(req);
}
