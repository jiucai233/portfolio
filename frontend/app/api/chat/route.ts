import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log(`Connecting to Backend: ${apiUrl}/v1/chat`);

    const response = await fetch('${apiUrl}/v1/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: body.messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Render Backend Error:", errorData);
      return NextResponse.json({ error: errorData.detail }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}