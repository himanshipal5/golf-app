import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* HERO */}
      <section style={{
        minHeight: '88vh',
        display: 'flex',
        alignItems: 'center',
        background: 'radial-gradient(ellipse at top left, #00c89610 0%, #0d0d0d 60%)',
        padding: '60px 0'
      }}>
        <div className="container">
          <div style={{ maxWidth: '620px' }}>
            <span className="tag tag-green" style={{ marginBottom: '20px' }}>
              Play Golf. Give Back. Win Big.
            </span>
            <h1 style={{
              fontSize: 'clamp(36px, 6vw, 64px)',
              fontWeight: '800',
              lineHeight: 1.15,
              margin: '16px 0 24px',
              color: '#fff'
            }}>
              Every Score You Enter<br />
              <span style={{ color: '#00c896' }}>Changes a Life</span>
            </h1>
            <p style={{
              fontSize: '18px',
              color: '#999',
              lineHeight: 1.7,
              marginBottom: '36px'
            }}>
              GolfGives connects your passion for golf with meaningful charity impact.
              Enter your Stableford scores, join monthly prize draws, and watch your
              game help communities thrive.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {user ? (
                <Link to="/dashboard">
                  <button className="btn btn-green" style={{ fontSize: '16px', padding: '14px 32px' }}>
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <button className="btn btn-green" style={{ fontSize: '16px', padding: '14px 32px' }}>
                      Start Your Journey
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="btn btn-outline" style={{ fontSize: '16px', padding: '14px 32px' }}>
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 0', background: '#111' }}>
        <div className="container">
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            color: '#fff',
            marginBottom: '12px'
          }}>
            How It Works
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '52px',
            fontSize: '16px'
          }}>
            Simple. Transparent. Impactful.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px'
          }}>
            {[
              {
                num: '01',
                title: 'Subscribe',
                desc: 'Pick a monthly or yearly plan. A portion goes straight to your chosen charity.'
              },
              {
                num: '02',
                title: 'Enter Scores',
                desc: 'Log your last 5 Stableford scores after each round. Quick and easy.'
              },
              {
                num: '03',
                title: 'Monthly Draw',
                desc: 'Your scores enter the monthly prize draw. Match numbers to win big prizes.'
              },
              {
                num: '04',
                title: 'Give Back',
                desc: 'Watch your subscription make real impact for charities you care about.'
              }
            ].map((step) => (
              <div key={step.num} className="card" style={{ borderTop: '3px solid #00c896' }}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '800',
                  color: '#00c89630',
                  marginBottom: '12px'
                }}>
                  {step.num}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '10px'
                }}>
                  {step.title}
                </h3>
                <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRIZE POOL */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '12px',
            textAlign: 'center'
          }}>
            Prize Pool Breakdown
          </h2>
          <p style={{
            textAlign: 'center',
            color: '#666',
            marginBottom: '48px'
          }}>
            Every subscriber contributes. Every month someone wins.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            {[
              { match: '5 Number Match', share: '40%', label: 'Jackpot', color: '#f1c40f' },
              { match: '4 Number Match', share: '35%', label: 'Big Win', color: '#00c896' },
              { match: '3 Number Match', share: '25%', label: 'Winner', color: '#9b59b6' }
            ].map((tier) => (
              <div key={tier.match} className="card" style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '42px',
                  fontWeight: '800',
                  color: tier.color,
                  marginBottom: '8px'
                }}>
                  {tier.share}
                </div>
                <div style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#fff',
                  marginBottom: '6px'
                }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: '13px', color: '#666' }}>
                  {tier.match}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHARITY SECTION */}
      <section style={{
        padding: '80px 0',
        background: 'linear-gradient(135deg, #00c89608, #9b59b608)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#fff',
            marginBottom: '16px'
          }}>
            Your Game. Their Future.
          </h2>
          <p style={{
            fontSize: '17px',
            color: '#888',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.7
          }}>
            Minimum 10% of every subscription goes directly to a charity you choose.
            You can give more. Every round matters beyond the fairway.
          </p>
          {!user && (
            <Link to="/register">
              <button className="btn btn-green" style={{
                fontSize: '16px',
                padding: '14px 36px'
              }}>
                Join & Choose Your Charity
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: '#111',
        borderTop: '1px solid #222',
        padding: '32px 0',
        textAlign: 'center'
      }}>
        <p style={{ color: '#444', fontSize: '14px' }}>
          © 2026 GolfGives · Built with purpose
        </p>
      </footer>
    </div>
  )
}