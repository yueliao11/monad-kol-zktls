import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    appId: process.env.NEXT_PUBLIC_PRIMUS_APP_ID || '0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b',
    appSecret: process.env.PRIMUS_APP_SECRET || '0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4'
  })
}