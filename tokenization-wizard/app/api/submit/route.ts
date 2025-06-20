import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received submission', body);      // mock persistence
  return NextResponse.json({ ok: true });
}
