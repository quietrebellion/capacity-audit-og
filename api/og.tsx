import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const SECTION_MAP = [
  { key: 'energy', label: 'Energy', icon: '⚡', qCount: 4 },
  { key: 'attention', label: 'Attention', icon: '◎', qCount: 3 },
  { key: 'time', label: 'Time', icon: '◷', qCount: 3 },
];

function decodeScores(str: string) {
  if (!str || str.length !== 10) return null;
  const vals: number[] = [];
  for (let i = 0; i < 10; i++) {
    const ch = str[i];
    if (ch === 'a' || ch === 'A') vals.push(10);
    else if (/^[0-9]$/.test(ch)) vals.push(parseInt(ch, 10));
    else return null;
  }
  return vals;
}

function scoreColor(s: number) {
  return s <= 3 ? '#c44d3f' : s <= 6 ? '#d4a843' : '#6b9b5e';
}

function scoreLabel(s: number) {
  return s <= 2 ? 'Critical' : s <= 4 ? 'Depleted' : s <= 6 ? 'Stretched' : s <= 8 ? 'Resourced' : 'Thriving';
}

export default function handler(req: Request) {
  const url = new URL(req.url);
  const r = url.searchParams.get('r');
  const vals = r ? decodeScores(r) : null;

  // Fallback: generic card if no valid scores
  if (!vals) {
    return new ImageResponse(
      (
        <div style={{
          width: '1200', height: '630', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center', background: '#0a0a0a',
          fontFamily: 'sans-serif',
        }}>
          <div style={{ fontSize: 28, color: '#e8622a', letterSpacing: '0.2em', textTransform: 'uppercase' as const, marginBottom: 24 }}>
            Rebellion Collective
          </div>
          <div style={{ fontSize: 52, fontWeight: 600, color: '#ededed', marginBottom: 16 }}>
            The C.H.E.A.T. Code™ Capacity Audit
          </div>
          <div style={{ fontSize: 26, color: '#9a9692' }}>
            Ten questions. Two minutes. Find out where your capacity is being extracted.
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  // Calculate section averages
  let idx = 0;
  const sections = SECTION_MAP.map(s => {
    const qVals = vals.slice(idx, idx + s.qCount);
    idx += s.qCount;
    const avg = qVals.reduce((a, b) => a + b, 0) / qVals.length;
    return { ...s, avg };
  });

  const composite = sections.reduce((a, s) => a + s.avg, 0) / sections.length;
  const compStr = composite.toFixed(1);
  const color = scoreColor(composite);
  const label = scoreLabel(composite);

  return new ImageResponse(
    (
      <div style={{
        width: '1200', height: '630', display: 'flex', background: '#0a0a0a',
        fontFamily: 'sans-serif', padding: '48px 64px',
      }}>
        {/* Left: Score */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', width: '420px', borderRight: '1px solid #222',
          paddingRight: '48px',
        }}>
          <div style={{ fontSize: 20, color: '#9a9692', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 12 }}>
            Capacity Score
          </div>
          <div style={{ fontSize: 140, fontWeight: 700, color, lineHeight: 1 }}>
            {compStr}
          </div>
          <div style={{ fontSize: 28, color: '#ccc5bd', marginTop: 8 }}>
            {label}
          </div>
        </div>

        {/* Right: Dimensions + branding */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          paddingLeft: '48px', flex: 1,
        }}>
          {sections.map(s => (
            <div key={s.key} style={{ display: 'flex', flexDirection: 'column', marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#ededed' }}>
                  {s.icon} {s.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: scoreColor(s.avg) }}>
                  {s.avg.toFixed(1)}
                </div>
              </div>
              {/* Bar background */}
              <div style={{
                display: 'flex', width: '100%', height: 12,
                background: 'rgba(232,98,42,0.1)', borderRadius: 6,
              }}>
                {/* Bar fill */}
                <div style={{
                  width: `${(s.avg / 10) * 100}%`, height: '100%',
                  background: scoreColor(s.avg), borderRadius: 6,
                }} />
              </div>
            </div>
          ))}

          {/* Branding */}
          <div style={{
            display: 'flex', flexDirection: 'column', marginTop: 20,
            borderTop: '1px solid #222', paddingTop: 20,
          }}>
            <div style={{ fontSize: 18, color: '#e8622a', letterSpacing: '0.15em', textTransform: 'uppercase' as const }}>
              The C.H.E.A.T. Code™ Capacity Audit
            </div>
            <div style={{ fontSize: 16, color: '#8a8682', marginTop: 4 }}>
              capacityaudit.rebellioncollective.com
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
