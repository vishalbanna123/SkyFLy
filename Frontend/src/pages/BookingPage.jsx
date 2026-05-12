import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import { bookingAPI } from '../api/api';

export default function BookingPage({ goto, user, selectedFlight, setBookingData }) {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [seats, setSeats] = useState([]);
  const [seatClass, setSeatClass] = useState('economy');
  const [passengerName, setPassengerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    buildSeatMap();
  }, []);

  if (!selectedFlight) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No flight selected</h2>
        <button className="btn-primary" onClick={() => goto('results')} style={{ marginTop: '1rem' }}>
          Back to search
        </button>
      </div>
    );
  }

  const buildSeatMap = () => {
    const taken = [1, 5, 8, 12, 14, 18, 21, 24];
    const newSeats = [];
    const rows = 6;
    for (let r = 1; r <= rows; r++) {
      for (let s = 0; s < 7; s++) {
        if (s === 3) continue;
        const id = r * 10 + s;
        const isTaken = taken.includes(id);
        const col = s < 3 ? String.fromCharCode(65 + s) : String.fromCharCode(66 + s);
        newSeats.push({ id, row: r, col, taken: isTaken });
      }
    }
    setSeats(newSeats);
  };

  const getPrice = () => {
    if (seatClass === 'economy') return selectedFlight.economyPrice;
    if (seatClass === 'business') return selectedFlight.businessPrice;
    if (seatClass === 'first-class') return selectedFlight.firstClassPrice;
    return selectedFlight.economyPrice;
  };

  const handleContinueToPayment = async () => {
    setError('');

    if (!passengerName.trim()) {
      setError('Please enter passenger name');
      return;
    }

    try {
      setLoading(true);
      const response = await bookingAPI.createBooking({
        flightId: selectedFlight.id,
        passengerName,
        seatClass,
      });

      // Store booking data for payment page
      setBookingData({
        ...response.data.booking,
        flight: selectedFlight,
        totalPrice: getPrice(),
      });

      goto('payment');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => goto('home') },
    { label: 'Results', onClick: () => goto('results') },
    { label: 'Passenger details', active: true },
  ];

  return (
    <>
      <div className="page">
        <Breadcrumb items={breadcrumbItems} goto={goto} />

        <div className="booking-page">
          {/* Progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
                1
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--sky)' }}>Passenger details</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: '#dce3ea' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dce3ea', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
                2
              </div>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Seat selection</span>
            </div>
            <div style={{ flex: 1, height: '2px', background: '#dce3ea' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#dce3ea', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '600' }}>
                3
              </div>
              <span style={{ fontSize: '13px', color: 'var(--muted)' }}>Payment</span>
            </div>
          </div>

          <div className="booking-grid">
            <div>
              {/* Passenger 1 */}
              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head">
                  <i className="ti ti-user"></i>
                  <h3>Passenger Details</h3>
                  <span>Adult</span>
                </div>
                <div className="form-body">
                  {error && <div style={{ color: '#ff4757', fontSize: '14px', marginBottom: '16px' }}>{error}</div>}
                  <div className="form-row cols1">
                    <div className="form-group">
                      <label>Passenger Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name as on ID"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="form-row cols1">
                    <div className="form-group">
                      <label>Class of Travel</label>
                      <select value={seatClass} onChange={(e) => setSeatClass(e.target.value)} disabled={loading}>
                        <option value="economy">Economy - ${selectedFlight.economyPrice}</option>
                        {selectedFlight.businessPrice && <option value="business">Business - ${selectedFlight.businessPrice}</option>}
                        {selectedFlight.firstClassPrice && <option value="first-class">First Class - ${selectedFlight.firstClassPrice}</option>}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add passenger */}
              <div className="add-pax" onClick={() => alert('Passenger 2 form would expand here')}>
                <i className="ti ti-plus" style={{ fontSize: '16px' }}></i> Add another passenger
              </div>

              {/* Seat selection */}
              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head">
                  <i className="ti ti-armchair"></i>
                  <h3>Select your seat</h3>
                  <span style={{ cursor: 'pointer', textDecoration: 'underline', opacity: 0.7 }} onClick={() => alert('Skip seat')}>
                    Skip
                  </span>
                </div>
                <div className="form-body">
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                    <span>✈ IndiGo 6E 2108 · JAI → BOM · Boeing 737</span>
                  </div>
                  {/* Seat map */}
                  <div style={{ maxWidth: '320px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', justifyContent: 'center' }}>
                      {['A', 'B', 'C', '', 'D', 'E', 'F'].map((col, idx) => (
                        <div key={idx} style={{ width: col ? '36px' : '20px', textAlign: 'center', fontSize: '10px', color: 'var(--muted)' }}>
                          {col}
                        </div>
                      ))}
                    </div>
                    <div id="seat-map" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {seats.length > 0 && Array.from({ length: 6 }).map((_, row) => (
                        <div key={row} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: 'var(--muted)', width: '16px', textAlign: 'center' }}>{row + 1}</span>
                          {seats
                            .filter((s) => s.row === row + 1)
                            .map((seat) => (
                              <React.Fragment key={seat.id}>
                                {seat.col === 'D' && <div style={{ width: '20px' }}></div>}
                                <div
                                  className={`seat ${seat.taken ? 'taken' : selectedSeat?.id === seat.id ? 'selected' : 'free'}`}
                                  onClick={() => !seat.taken && setSelectedSeat(seat)}
                                  style={{
                                    width: '36px',
                                    height: '32px',
                                    borderRadius: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    cursor: seat.taken ? 'not-allowed' : 'pointer',
                                    border: `1px solid ${seat.taken ? '#e0e0e0' : selectedSeat?.id === seat.id ? 'var(--sky)' : '#b8e2c0'}`,
                                    background: seat.taken ? '#f0f0f0' : selectedSeat?.id === seat.id ? 'var(--sky)' : '#eaf6ec',
                                    color: seat.taken ? '#ccc' : selectedSeat?.id === seat.id ? '#fff' : '#2d7a3a',
                                  }}
                                >
                                  {seat.row}
                                  {seat.col}
                                </div>
                              </React.Fragment>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="seat-legend">
                    <span>
                      <div className="seat-dot" style={{ background: '#eaf6ec', border: '1px solid #b8e2c0' }}></div>
                      Available
                    </span>
                    <span>
                      <div className="seat-dot" style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }}></div>
                      Taken
                    </span>
                    <span>
                      <div className="seat-dot" style={{ background: 'var(--sky)' }}></div>
                      Selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head">
                  <i className="ti ti-backpack"></i>
                  <h3>Add-ons & extras</h3>
                </div>
                <div className="form-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>Extra baggage — 5 kg</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Add up to 20 kg checked baggage</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: 600 }}>₹650</span>
                      <input type="checkbox" style={{ accentColor: 'var(--sky)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>Travel insurance</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Covers cancellation, delay & medical</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--sky)', fontWeight: 600 }}>₹349</span>
                      <input type="checkbox" style={{ accentColor: 'var(--sky)' }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>Meal preference</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>Veg / Non-veg / Jain</div>
                    </div>
                    <select style={{ border: '1px solid #dce3ea', borderRadius: '6px', padding: '6px 10px', fontSize: '13px', fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                      <option>No preference</option>
                      <option>Vegetarian</option>
                      <option>Non-vegetarian</option>
                      <option>Jain</option>
                    </select>
                  </div>
                </div>
              </div>

              <button 
                className="btn-search" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '15px' }} 
                onClick={handleContinueToPayment}
                disabled={loading}
              >
                {loading ? 'Creating booking...' : 'Continue to payment →'}
              </button>
            </div>

            {/* ORDER SUMMARY */}
            <OrderSummary flight={selectedFlight} seatClass={seatClass} price={getPrice()} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

function OrderSummary({ flight, seatClass, price }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const classLabel = seatClass === 'business' ? 'Business' : seatClass === 'first-class' ? 'First Class' : 'Economy';

  return (
    <div className="order-card">
      <div className="order-head">
        <h3>Booking summary</h3>
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
          {flight?.airline} · {flight?.flightNumber}<br />
          {flight?.departureTime && new Date(flight.departureTime).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })} · {flight?.departureTime && formatTime(flight.departureTime)} – {flight?.arrivalTime && formatTime(flight.arrivalTime)}<br />
          {classLabel} · 1 Adult<br />
          Aircraft: {flight?.aircraft}
        </div>
      </div>
      <div className="price-breakdown">
        <div className="pb-row">
          <span>Base fare (1 adult)</span>
          <span>${price}</span>
        </div>
        <div className="pb-row">
          <span>Taxes & fees</span>
          <span>${Math.round(price * 0.15)}</span>
        </div>
        <div className="pb-row total">
          <span>Total payable</span>
          <span>${Math.round(price * 1.15)}</span>
        </div>
      </div>
    </div>
  );
}
