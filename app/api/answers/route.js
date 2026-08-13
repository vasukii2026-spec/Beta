import { NextResponse } from 'next/server';
import { saveAnswers, getAllAnswers } from '../../../lib/db';

// Anyone visiting the site can POST — that's her submitting her answers.
export async function POST(request) {
  try {
    const body = await request.json();
    const entries = body.entries;

    if (!Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: 'No answers received.' }, { status: 400 });
    }

    for (const entry of entries) {
      if (!entry.questionId || !entry.questionText || typeof entry.answer !== 'string') {
        return NextResponse.json({ error: 'Malformed answer.' }, { status: 400 });
      }
    }

    await saveAnswers(entries);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not save your answers.' }, { status: 500 });
  }
}

// Only you should be able to GET — it checks the admin password against
// the ADMIN_PASSWORD environment variable you set in Vercel.
export async function GET(request) {
  try {
    const password = request.headers.get('x-admin-password');

    if (!process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'ADMIN_PASSWORD is not set on the server yet.' },
        { status: 500 }
      );
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
    }

    const rows = await getAllAnswers();
    return NextResponse.json({ rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Could not load answers.' }, { status: 500 });
  }
}
