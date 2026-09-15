import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    
    const validUsername = (process.env.ADMIN_USERNAME || 'admin@royaluzhavan.com').trim();
    const validPassword = (process.env.ADMIN_PASSWORD || 'Theevanam@1995').trim();

    // Safely trim and compare to avoid accidental spaces causing login failures
    const inputUser = (typeof username === 'string' ? username.trim() : '');
    const inputPass = (typeof password === 'string' ? password.trim() : '');

    if (inputUser === validUsername && inputPass === validPassword) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Bad request' }, { status: 400 });
  }
}
