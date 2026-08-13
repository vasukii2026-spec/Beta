import { neon } from '@neondatabase/serverless';

// Vercel's Neon integration sets one of these automatically once you
// connect a Postgres database to the project (see README step 5).
function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED
  );
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
