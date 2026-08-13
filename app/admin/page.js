'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [rows, setRows] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [errorMsg, setErrorMsg] = useState('');

  const loadAnswers = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/answers', {
        headers: { 'x-admin-password': password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not load answers.');
      setRows(data.rows);
      setStatus('idle');
    } catch (err) {
      setErrorMsg(err.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  return (
    <div className="admin-wrap">
      <div className="admin-inner">
        <h1>Her answers</h1>
        <p className="muted">Private — only visible with the admin password.</p>

        <form className="password-row" onSubmit={loadAnswers}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="submit-btn" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Checking…' : 'View answers'}
          </button>
        </form>

        {status === 'error' && <p className="status-msg error">{errorMsg}</p>}

        {rows && rows.length === 0 && (
          <p className="muted">No answers submitted yet.</p>
        )}

        {rows &&
          rows.map((row) => (
            <div className="answer-card" key={row.id}>
              <div className="q">{row.question_text}</div>
              <p className="a">{row.answer}</p>
              <div className="t">{new Date(row.submitted_at).toLocaleString()}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
