import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': 'localhost:3003',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export function handleOptions() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  })
}
