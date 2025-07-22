import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const signParams = searchParams.get('signParams')
  
  if (!signParams) {
    return NextResponse.json({ error: 'Missing signParams' }, { status: 400 })
  }

  try {
    // Use the new X Web3 KOL app credentials
    const appId = process.env.NEXT_PUBLIC_PRIMUS_APP_ID || '0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b'
    const appSecret = process.env.PRIMUS_APP_SECRET || '0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4'
    
    if (!appId || !appSecret) {
      return NextResponse.json({ error: 'Primus credentials not configured' }, { status: 500 })
    }

    // Dynamic import to avoid SSR issues
    const { PrimusZKTLS } = await import('@primuslabs/zktls-js-sdk')
    
    // Create PrimusZKTLS instance
    const primusZKTLS = new PrimusZKTLS()
    
    // Initialize with X Web3 KOL app credentials
    await primusZKTLS.init(appId, appSecret)
    
    // Sign the request
    const signResult = await primusZKTLS.sign(signParams)
    
    return NextResponse.json({ signResult })
  } catch (error) {
    console.error('Error signing request:', error)
    return NextResponse.json({ error: 'Failed to sign request' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { signParams } = await request.json()
    
    if (!signParams) {
      return NextResponse.json({ error: 'Missing signParams' }, { status: 400 })
    }

    // Get app credentials
    const appId = process.env.NEXT_PUBLIC_PRIMUS_APP_ID || '0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b'
    const appSecret = process.env.PRIMUS_APP_SECRET || '0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4'

    // Dynamic import for server-side Primus SDK
    const { PrimusZKTLS } = await import('@primuslabs/zktls-js-sdk')

    // Create PrimusZKTLS instance for server-side signing
    const primusZKTLS = new PrimusZKTLS()

    // Initialize with appId and appSecret
    await primusZKTLS.init(appId, appSecret)

    // Sign the request parameters
    console.log('Signing request with params:', signParams)
    const signResult = await primusZKTLS.sign(signParams)
    console.log('Sign result:', signResult)

    // Return signed result
    return NextResponse.json({ signResult })
  } catch (error) {
    console.error('Failed to sign request:', error)
    return NextResponse.json(
      { error: 'Failed to sign request: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}