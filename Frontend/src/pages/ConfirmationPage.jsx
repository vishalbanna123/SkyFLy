import React from 'react';
import Footer from '../components/Footer';

export default function ConfirmationPage({ goto }) {
  return (
    <>
      <div className="page">
        <div className="confirm-page">
          <div className="confirm-icon">
            <i className="ti ti-check"></i>
          </div>
          <h1 className="confirm-title">Booking confirmed!</h1>
          <p className="confirm-sub">Your e-ticket has been sent to rahul.sharma@example.com · Check your inbox</p>

          <div className="pnr-box">
            <div className="pnr-label">YOUR PNR NUMBER</div>
            <div className="pnr-code">SF7K3M</div>
            <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '6px' }}>Keep this safe — you'll need it at the airport</div>
          </div>

          <div className="ticket-card">
            <div className="ticket-head">
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600' }}>IndiGo · 6E 2108</div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Economy · Boeing 737-800</div>
              </div>
              <span className="tag tag-info">Nonstop · 1h 55m</span>
            </div>
            <div className="ticket-body">
              <div>
                <div className="tkt-time">06:10</div>
                <div className="tkt-city">JAI — Jaipur</div>
              </div>
              <div className="tkt-dur">
                <div className="dur-line" style={{ justifyContent: 'center' }}>
                  <div className="dl-dot"></div>
                  <div className="dl-seg"></div>
                  <i className="ti ti-plane dl-plane"></i>
                  <div className="dl-seg"></div>
                  <div className="dl-dot"></div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>1h 55m</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tkt-time">08:05</div>
                <div className="tkt-city">BOM — Mumbai</div>
              </div>
            </div>
            <div className="tkt-date-row">
              <div>
                <span className="tkt-meta">Date: </span>
                <span className="tkt-val">Thursday, 15 May 2026</span>
              </div>
              <div>
                <span className="tkt-meta">Seat: </span>
                <span className="tkt-val">14A (Window)</span>
              </div>
              <div>
                <span className="tkt-meta">Baggage: </span>
                <span className="tkt-val">15 kg</span>
              </div>
            </div>
            <div className="ticket-footer">
              <div>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Passenger</div>
                <div style={{ fontSize: '14px', fontWeight: '600' }}>Rahul Sharma</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Total paid</div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--sky)' }}>₹4,239</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '2rem' }}>
            <button className="btn-search" onClick={() => alert('Downloading e-ticket PDF...')}>
              <i className="ti ti-download"></i>Download e-ticket
            </button>
            <button style={{ padding: '12px 24px', border: '1px solid var(--sky)', borderRadius: '8px', color: 'var(--sky)', background: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Opening calendar...')}>
              <i className="ti ti-calendar-plus"></i>Add to calendar
            </button>
            <button style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--muted)', background: '#fff', fontSize: '14px', cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('Sharing...')}>
              <i className="ti ti-share"></i>Share
            </button>
          </div>

          {/* Next steps */}
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '16px', marginBottom: '1rem' }}>What's next?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sky-light)', color: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: '0' }}>
                  <i className="ti ti-mail"></i>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Check your email</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>E-ticket sent to rahul.sharma@example.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sky-light)', color: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: '0' }}>
                  <i className="ti ti-clock"></i>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Web check-in opens</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Available 48h before departure · 14 May from 06:10</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--sky-light)', color: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: '0' }}>
                  <i className="ti ti-map-2"></i>
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>Arrive at airport</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Jaipur International — 2h before departure (by 04:10)</div>
                </div>
              </div>
            </div>
          </div>

          <button className="btn-search" style={{ marginTop: '1.5rem', padding: '12px 32px' }} onClick={() => goto('home')}>
            <i className="ti ti-home"></i>Back to home
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
