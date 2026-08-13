'use client';

/**
 * ───────────────────────────────────────────────────────────────
 * BEFORE YOU SEND THIS: personalize the parts marked "EDIT THIS".
 * Search this file for "EDIT THIS" — that's the ledger items,
 * the letter paragraphs, and the questions. Nothing here uses
 * her name yet on purpose; go put it in.
 * ───────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react';

// EDIT THIS — small, specific, true things. Vague praise reads as
// generic; specifics read as noticed. Replace all five.
const LEDGER = [
  'I set an alarm for her medicine even on days I don’t say anything about it.',
  'I remember which relatives she actually enjoys talking to, and which calls she dreads.',
  'I’ve rearranged my shifts more than once without telling her, just so I’d be around.',
  'I notice when she goes quiet at dinner, even when I don’t know how to ask about it well.',
  'I think about our future out loud, even on days it’s just chores and traffic.',
];

// EDIT THIS — open, honest questions. Keep them about her experience,
// not about defending yours. Add, remove, or reorder as needed.
const QUESTIONS = [
  {
    id: 'unseen',
    text: 'What’s one thing I’ve missed lately that actually mattered to you?',
  },
  {
    id: 'understood',
    text: 'When do you feel most understood by me — and when do you feel least understood?',
  },
  {
    id: 'words_vs_actions',
    text: 'Is it more that I don’t do enough, or that I don’t say enough? Or something else entirely?',
  },
  {
    id: 'this_week',
    text: 'What happened recently that made you feel like I don’t care?',
  },
  {
    id: 'one_change',
    text: 'If I changed just one thing starting today, what would help the most?',
  },
  {
    id: 'anything_else',
    text: 'Anything else you want me to know that’s hard to say out loud?',
  },
  {
    id: 'message_for_him',
    text: 'Anything you want to say back to me — write it here, however long or short.',
    type: 'text',
  },
  {
    id: 'forgive',
    text: 'After everything I\u2019ve said — where\u2019s your heart with forgiving me, right now?',
    type: 'choice',
    options: ['I forgive you 💛', 'I want to, I\u2019m just not there yet 🌱', 'I need more time, and that\u2019s okay 🕊️'],
  },
];

function useReveal() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

function Reveal({ children, as: Tag = 'div', delay = 0 }) {
  const [ref, inView] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'in' : ''}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

export default function Page() {
  const [open, setOpen] = useState(false);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const entries = QUESTIONS.map((q) => ({
      questionId: q.id,
      questionText: q.text,
      answer: (answers[q.id] || '').trim(),
    })).filter((entry) => entry.answer.length > 0);

    if (entries.length === 0) {
      setErrorMsg('Answer at least one before sending — even a few words is fine.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setStatus('done');
    } catch (err) {
      setErrorMsg(err.message || 'Could not send. Try again in a moment.');
      setStatus('error');
    }
  };

  return (
    <main>
      <section className={`hero ${open ? 'revealed' : ''}`}>
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-inner">
          <span className="hero-eyebrow">For you — open when ready</span>
          <button
            className="envelope-wrap"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-label="Open the letter"
          >
            <div className={`envelope ${open ? 'open' : ''}`}>
              <div className="envelope-letter-peek" />
              <div className="envelope-shadow-flap" />
              <div className="envelope-body" />
              <div className="envelope-flap" />
              <div className="seal" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 21s-7-4.5-9.5-9C.5 8 2 4 6 4c2 0 4 1.5 6 4 2-2.5 4-4 6-4 4 0 5.5 4 3.5 8-2.5 4.5-9.5 9-9.5 9z"
                    stroke="#f5eedc"
                    strokeWidth="1.4"
                  />
                </svg>
              </div>
            </div>
            <span className="envelope-cta">{open ? 'reading…' : 'tap to open'}</span>
          </button>
          <div className="scroll-cue" />
        </div>
      </section>

      <section className="letter">
        <Reveal>
          <span className="eyebrow">First, the part I keep getting wrong</span>
          <h2>You told me you feel like I don’t care. I believe you.</h2>
          <p>
            {/* EDIT THIS — replace with something true and specific about
                what she said and how you actually took it in. */}
            Not because it’s comfortable to hear, but because when someone you
            love tells you how they feel, the only useful response is to
            listen — not to explain why they shouldn’t feel that way. I’ve
            been doing too much of the second thing lately.
          </p>
          <p>
            I don’t want this to be a page that argues you out of how you
            feel. It’s not a defense. It’s me trying to slow down enough to
            actually hear you, and to show you a few of the ways I do think
            about you — even if I’m clearly not saying or showing it well
            enough.
          </p>
        </Reveal>
      </section>

      <hr className="divider" />

      <section className="letter">
        <Reveal>
          <span className="eyebrow">Some of what I carry, quietly</span>
          <h2>None of this is the point. You are.</h2>
          <p className="muted">
            I’m not listing these to keep score — I’m listing them because I
            realized I never say them out loud.
          </p>
        </Reveal>
        <div className="ledger">
          {LEDGER.map((item, i) => (
            <Reveal as="div" key={i} delay={i * 80}>
              <div className="ledger-item">
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="letter">
        <Reveal>
          <span className="eyebrow">What I want, going forward</span>
          <h2>Not to be forgiven. To actually understand you.</h2>
          <p>
            {/* EDIT THIS — say what you actually want to happen next,
                in your own words. */}
            I don’t want a version of this where you say it’s fine and we
            both move on without anything changing. I’d rather know the
            real, specific things — even the small ones — so I can actually
            do something about them instead of guessing.
          </p>
          <p className="signoff">So — tell me. I’m listening.</p>
        </Reveal>
      </section>

      <section className="qa-section">
        <div className="qa-inner">
          <Reveal>
            <span className="eyebrow">Your turn, whenever you’re ready</span>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: 'clamp(26px,4vw,34px)', margin: '0 0 12px' }}>
              Answer whatever you want. Skip the rest.
            </h2>
            <p className="muted" style={{ marginBottom: 40 }}>
              Only I can read these — they go straight to me, not anywhere
              public.
            </p>
          </Reveal>

          {status === 'done' ? (
            <Reveal>
              <div className="thank-you" style={{ padding: '20px 0' }}>
                <h2>Thank you for telling me.</h2>
                <p>I’ll read every word. I mean that.</p>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit}>
              {QUESTIONS.map((q, i) => (
                <Reveal as="div" key={q.id} delay={Math.min(i, 3) * 70}>
                  <div className={`question-block ${q.id === 'forgive' ? 'forgive-block' : ''}`}>
                    <label htmlFor={q.type === 'choice' ? undefined : q.id} id={q.type === 'choice' ? q.id : undefined}>
                      <span className="q-num">
                        {String(i + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
                      </span>
                      {q.text}
                    </label>
                    {q.type === 'choice' ? (
                      <div className="choice-row" role="group" aria-labelledby={q.id}>
                        {q.options.map((option) => (
                          <button
                            key={option}
                            type="button"
                            className={`choice-btn ${answers[q.id] === option ? 'selected' : ''}`}
                            onClick={() => handleAnswerChange(q.id, option)}
                            aria-pressed={answers[q.id] === option}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        id={q.id}
                        value={answers[q.id] || ''}
                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                        placeholder="As much or as little as you want to write…"
                      />
                    )}
                  </div>
                </Reveal>
              ))}

              <div className="submit-row">
                <button className="submit-btn" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send this to me'}
                </button>
                {status === 'error' && <span className="status-msg error">{errorMsg}</span>}
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="site-footer">made for you, by me</footer>
    </main>
  );
}
