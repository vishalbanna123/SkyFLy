import React, { useState, useEffect } from 'react';
import Breadcrumb from '../components/Breadcrumb';
import Footer from '../components/Footer';
import { flightAPI } from '../api/api';

export default function ResultsPage({ goto, user, setSelectedFlight }) {
  const [sortBy, setSortBy] = useState('cheapest');
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await flightAPI.getAllFlights(1, 50);
      // Sort by cheapest by default
      const sorted = (response.data.flights || []).sort((a, b) => a.economyPrice - b.economyPrice);
      setFlights(sorted);
    } catch (err) {
      setError('Failed to load flights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = (flight) => {
    if (!user) {
      goto('login');
      return;
    }
    setSelectedFlight(flight);
    goto('booking');
  };

  const breadcrumbItems = [
    { label: 'Home', onClick: () => goto('home') },
    { label: 'Flight results', active: true },
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const calculateDuration = (departure, arrival) => {
    const diff = new Date(arrival) - new Date(departure);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const getSortedFlights = () => {
    let sorted = [...flights];
    if (sortBy === 'cheapest') {
      sorted.sort((a, b) => a.economyPrice - b.economyPrice);
    } else if (sortBy === 'fastest') {
      sorted.sort((a, b) => {
        const durA = new Date(a.arrivalTime) - new Date(a.departureTime);
        const durB = new Date(b.arrivalTime) - new Date(b.departureTime);
        return durA - durB;
      });
    } else if (sortBy === 'earliest') {
      sorted.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
    }
    return sorted;
  };

  return (
    <>
      <div className="page">
        {/* Mini search bar */}
        <div style={{ background: '#0d2b47', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div className="sf-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', flex: '0 0 auto' }}>
              <i className="ti ti-plane" style={{ color: 'rgba(255,255,255,0.6)' }}></i>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>All Flights</span>
            </div>
            <button className="btn-search" style={{ marginLeft: 'auto' }} onClick={fetchFlights}>
              <i className="ti ti-refresh"></i>Refresh
            </button>
          </div>
        </div>

        <Breadcrumb items={breadcrumbItems} goto={goto} />

        <div className="results-layout">
          {/* Filters */}
          <div className="filter-panel">
            <div className="filter-title">Filters</div>
            <div className="filter-section">
              <h4>Price range</h4>
              <input type="range" className="range-slider" min="0" max="3000" defaultValue="3000" />
            </div>
          </div>

          {/* Results */}
          <div className="results-panel">
            <div className="results-bar">
              <div className="results-info">
                <strong>{loading ? 'Loading...' : `${flights.length} flights`}</strong> found
              </div>
              <div className="sort-row">
                <button className={`sort-btn ${sortBy === 'cheapest' ? 'active' : ''}`} onClick={() => setSortBy('cheapest')}>
                  Cheapest
                </button>
                <button className={`sort-btn ${sortBy === 'fastest' ? 'active' : ''}`} onClick={() => setSortBy('fastest')}>
                  Fastest
                </button>
                <button className={`sort-btn ${sortBy === 'earliest' ? 'active' : ''}`} onClick={() => setSortBy('earliest')}>
                  Earliest
                </button>
              </div>
            </div>

            {error && <div style={{ color: '#ff4757', padding: '1rem', textAlign: 'center' }}>{error}</div>}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Loading flights...</div>
            ) : flights.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>No flights found</div>
            ) : (
              getSortedFlights().map((flight) => (
                <div key={flight.id} className="flight-card">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="al-logo">{flight.airline.substring(0, 2)}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{flight.airline}</div>
                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{flight.flightNumber}</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="fc-time">{formatTime(flight.departureTime)}</div>
                    <div className="fc-code">{flight.departureAirport}</div>
                  </div>
                  <div className="fc-dur">
                    <div className="dur-line">
                      <div className="dl-dot"></div>
                      <div className="dl-seg"></div>
                      <i className="ti ti-plane dl-plane"></i>
                      <div className="dl-seg"></div>
                      <div className="dl-dot"></div>
                    </div>
                    <div className="dur-text">{calculateDuration(flight.departureTime, flight.arrivalTime)}</div>
                    <span className={`stop-badge ${flight.stops === 0 ? 'ns' : 'os'}`}>
                      {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop`}
                    </span>
                  </div>
                  <div>
                    <div className="fc-time">{formatTime(flight.arrivalTime)}</div>
                    <div className="fc-code">{flight.arrivalAirport}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                    <span>Economy</span>
                    <br />
                    <span style={{ color: flight.availableSeats > 0 ? '#2d7a3a' : '#ff4757', fontSize: '11px' }}>
                      {flight.availableSeats > 0 ? `✓ ${flight.availableSeats} seats` : '✗ Sold out'}
                    </span>
                  </div>
                  <div className="fc-price">
                    <div className="price">${flight.economyPrice}</div>
                    <div className="per">per person</div>
                    <button 
                      className="btn-book" 
                      onClick={() => handleBookFlight(flight)}
                      disabled={flight.availableSeats === 0}
                    >
                      {user ? 'Select →' : 'Login'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
