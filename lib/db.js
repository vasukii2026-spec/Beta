import { neon } from '@neondatabase/serverless';

// Vercel's Neon integration sets a connection env var automatically once
// you connect a Postgres database to the project (see README step 5).
// The exact variable name can vary — it's usually DATABASE_URL or
// POSTGRES_URL, but if a custom prefix was set during Connect (e.g.
// "STORAGE"), it becomes something like STORAGE_DATABASE_URL instead.
// Rather than hardcode one name, scan every env var for anything that
// looks like a Postgres connection string.
function getConnectionString() {
  const direct =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (direct) return direct;

  const match = Object.entries(process.env).find(
    ([key, value]) =>
      /(DATABASE|POSTGRES)_URL/i.test(key) &&
      typeof value === 'string' &&
      value.startsWith('postgres')
  );

  return match ? match[1] : undefined;
}

function getSql() {
  const connectionString = getConnectionString();
  if (!connectionString) {
    throw new Error(
      'No database connected yet. Add a Postgres database to this project in Vercel (Storage tab).'
    );
  }
  return neon(connectionString);
}

export async function ensureTable() {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS answers (
      id SERIAL PRIMARY KEY,
      question_id TEXT NOT NULL,
      question_text TEXT NOT NULL,
      answer TEXT NOT NULL,
      submitted_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
}

export async function saveAnswers(entries) {
  const sql = getSql();
  await ensureTable();
  for (const entry of entries) {
    await sql`
      INSERT INTO answers (question_id, question_text, answer)
      VALUES (${entry.questionId}, ${entry.questionText}, ${entry.answer});
    `;
  }
}

export async function getAllAnswers() {
  const sql = getSql();
  await ensureTable();
  const rows = await sql`
    SELECT id, question_id, question_text, answer, submitted_at
    FROM answers
    ORDER BY submitted_at DESC;
  `;
  return rows;
}
