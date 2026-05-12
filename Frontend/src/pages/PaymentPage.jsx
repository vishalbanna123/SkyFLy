import React, { useState } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import { paymentAPI } from '../api/api';

export default function PaymentPage({ goto, bookingData }) {
  const [payMethod, setPayMethod] = useState('card');
  const [cardData, setCardData] = useState({ number: '', name: '', exp: '', cvv: '' });
  const [activeUpi, setActiveUpi] = useState('gpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!bookingData) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No booking data</h2>
        <button className="btn-primary" onClick={() => goto('home')} style={{ marginTop: '1rem' }}>
          Back to home
        </button>
      </div>
    );
  }

  const totalAmount = Math.round(bookingData.totalPrice * 1.15);

  const handlePaymentSubmit = async () => {
    setError('');

    if (payMethod === 'card') {
      if (!cardData.number || !cardData.name || !cardData.exp || !cardData.cvv) {
        setError('Please fill all card details');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await paymentAPI.createPayment({
        bookingId: bookingData.id,
        amount: totalAmount,
        paymentMethod: payMethod,
        transactionId: 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        status: 'completed',
      });

      // Payment successful, go to confirmation
      goto('confirmation');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCardChange = (field, value) => {
    setCardData({ ...cardData, [field]: value });
  };

  const formatCard = (value) => {
    return value.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExp = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2, 4);
    return v;
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => goto('home') },
    { label: 'Results', onClick: () => goto('results') },
    { label: 'Passenger details', onClick: () => goto('booking') },
    { label: 'Payment', active: true },
  ];

  return (
    <>
      <div className="page">
        <Breadcrumb items={breadcrumbItems} goto={goto} />

        <div className="payment-page">
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2d7a3a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                <i className="ti ti-check" style={{ fontSize: '14px' }}></i>
              </div>
              <span style={{ fontSize: '13px', color: '#2d7a3a' }}>Passenger details</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: '#2d7a3a' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#2d7a3a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                <i className="ti ti-check" style={{ fontSize: '14px' }}></i>
              </div>
              <span style={{ fontSize: '13px', color: '#2d7a3a' }}>Seat selection</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: 'var(--sky)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
                3
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--sky)' }}>Payment</span>
            </div>
          </div>

          <div className="payment-grid">
            <div>
              <div className="form-card">
                <div className="form-card-head">
                  <i className="ti ti-credit-card"></i>
                  <h3>Choose payment method</h3>
                </div>
                <div className="form-body">
                  {error && <div style={{ color: '#ff4757', fontSize: '14px', marginBottom: '16px', background: 'rgba(255,71,87,0.1)', padding: '10px', borderRadius: '6px' }}>{error}</div>}
                  <div className="pay-methods">
                    <button className={`pay-method ${payMethod === 'card' ? 'active' : ''}`} onClick={() => setPayMethod('card')} disabled={loading}>
                      <i className="ti ti-credit-card"></i>Credit / Debit card
                    </button>
                    <button className={`pay-method ${payMethod === 'upi' ? 'active' : ''}`} onClick={() => setPayMethod('upi')} disabled={loading}>
                      <i className="ti ti-qrcode"></i>UPI
                    </button>
                    <button className={`pay-method ${payMethod === 'nb' ? 'active' : ''}`} onClick={() => setPayMethod('nb')} disabled={loading}>
                      <i className="ti ti-building-bank"></i>Net banking
                    </button>
                    <button className={`pay-method ${payMethod === 'wallet' ? 'active' : ''}`} onClick={() => setPayMethod('wallet')} disabled={loading}>
                      <i className="ti ti-wallet"></i>Wallets
                    </button>
                  </div>

                  {payMethod === 'card' && (
                    <div>
                      <div className="card-preview">
                        <div className="card-chip"></div>
                        <div className="card-number">{cardData.number || '•••• •••• •••• ••••'}</div>
                        <div className="card-row">
                          <div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>CARD HOLDER</div>
                            <div className="card-name">{cardData.name.toUpperCase() || 'YOUR NAME'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '10px', opacity: 0.6 }}>VALID THRU</div>
                            <div className="card-name">{cardData.exp || 'MM/YY'}</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Card number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                            value={cardData.number}
                            onChange={(e) => handleCardChange('number', formatCard(e.target.value))}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="form-row cols3">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label>Name on card</label>
                          <input type="text" placeholder="As on card" onChange={(e) => handleCardChange('name', e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                          <label>Expiry</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardData.exp}
                            onChange={(e) => handleCardChange('exp', formatExp(e.target.value))}
                            disabled={loading}
                          />
                        </div>
                      </div>
                      <div className="form-row cols2">
                        <div className="form-group">
                          <label>CVV</label>
                          <input type="password" placeholder="•••" maxLength="4" onChange={(e) => handleCardChange('cvv', e.target.value)} disabled={loading} />
                        </div>
                        <div className="form-group">
                          <label>Save card?</label>
                          <select disabled={loading}>
                            <option>Don't save</option>
                            <option>Save for future use</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {payMethod === 'upi' && (
                    <div>
                      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>Pay using any UPI app</p>
                      <div className="upi-logos">
                        {['GPay', 'Paytm', 'PhonePe', 'BHIM'].map((logo) => (
                          <div
                            key={logo}
                            className={`upi-logo ${logo.toLowerCase()} ${activeUpi === logo.toLowerCase() ? 'active' : ''}`}
                            onClick={() => !loading && setActiveUpi(logo.toLowerCase())}
                            style={{
                              color: logo === 'GPay' ? '#4285f4' : logo === 'Paytm' ? '#00b9f5' : logo === 'PhonePe' ? '#5f259f' : 'inherit',
                              opacity: loading ? 0.5 : 1,
                              cursor: loading ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {logo}
                          </div>
                        ))}
                      </div>
                      <div className="form-group">
                        <label>Or enter UPI ID</label>
                        <input type="text" placeholder="yourname@upi" disabled={loading} />
                      </div>
                    </div>
                  )}

                  {payMethod === 'nb' && (
                    <div>
                      <p style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '12px' }}>Select your bank</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '1rem' }}>
                        {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map((bank) => (
                          <div key={bank} className="time-pill" style={{ padding: '10px', opacity: loading ? 0.5 : 1 }}>
                            {bank}
                          </div>
                        ))}
                      </div>
                      <div className="form-group">
                        <label>Or search your bank</label>
                        <input type="text" placeholder="Type bank name..." disabled={loading} />
                      </div>
                    </div>
                  )}

                  {payMethod === 'wallet' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
                      {['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge'].map((wallet) => (
                        <div key={wallet} className="time-pill" style={{ padding: '12px', fontSize: '12px', opacity: loading ? 0.5 : 1 }}>
                          {wallet}
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    className="btn-search" 
                    style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px', marginTop: '1.5rem', borderRadius: '10px' }} 
                    onClick={handlePaymentSubmit}
                    disabled={loading}
                  >
                    <i className="ti ti-lock"></i>Pay securely ${totalAmount}
                  </button>
                  <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <i className="ti ti-shield-check" style={{ fontSize: '14px', color: '#2d7a3a' }}></i>256-bit SSL - PCI-DSS compliant - Safe checkout
                  </p>
                </div>
              </div>
            </div>

            {/* SUMMARY */}
            <OrderSummary2 booking={bookingData} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function OrderSummary2({ booking, totalAmount }) {
  if (!booking) return null;

  const flight = booking.flight;
  return (
    <div>
      <div className="order-card" style={{ position: 'static' }}>
        <div className="order-head">
          <h3>Order summary</h3>
        </div>
        <div className="flight-summary">
          <div className="fs-route">
            <span className="fs-city">{flight?.departureAirport}</span>
            <i className="ti ti-arrow-right fs-arrow"></i>
            <span className="fs-city">{flight?.arrivalAirport}</span>
            <span className="tag tag-info" style={{ marginLeft: 'auto' }}>
              {flight?.stops === 0 ? 'Nonstop' : `${flight?.stops} Stop`}
            </span>
          </div>
          <div className="fs-details">
            {flight?.airline} {flight?.flightNumber} - {new Date(flight?.departureTime).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}<br />
            {new Date(flight?.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} to {new Date(flight?.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })} - {flight?.duration}<br />
            {booking.seatClass} - {booking.passengerName}
          </div>
        </div>
        <div className="price-breakdown">
          <div className="pb-row">
            <span>Base fare</span>
            <span>${booking.totalPrice}</span>
          </div>
          <div className="pb-row">
            <span>Taxes & fees</span>
            <span>${Math.round(booking.totalPrice * 0.15)}</span>
          </div>
          <div className="pb-row total">
            <span>Total</span>
            <span>${totalAmount}</span>
          </div>
        </div>
        <div style={{ padding: '1rem 1.5rem' }}>
          <div style={{ background: '#eaf6ec', borderRadius: '8px', padding: '10px 12px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <i className="ti ti-check" style={{ color: '#2d7a3a', marginTop: '1px' }}></i>
            <div style={{ fontSize: '12px', color: '#2d7a3a', lineHeight: 1.6 }}>
              Booking reference: {booking.bookingReference}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
