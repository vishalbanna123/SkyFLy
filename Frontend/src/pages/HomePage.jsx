import React, { useState } from 'react';
import Footer from '../components/Footer';

export default function HomePage({ goto, user, setSearchParams }) {
  const [swapped, setSwapped] = useState(false);
  const [fromCity, setFromCity] = useState('Jaipur');
  const [toCity, setToCity] = useState('Mumbai');
  const [departDate, setDepartDate] = useState('2026-05-15');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [travellers, setTravellers] = useState('1 Adult · Economy');

  const cities = [
    { name: 'Jaipur', code: 'JAI', airport: "Jaipur Int'l" },
    { name: 'Delhi', code: 'DEL', airport: 'Indira Gandhi Int\'l' },
    { name: 'Mumbai', code: 'BOM', airport: 'Chhatrapati Shivaji' },
    { name: 'Bengaluru', code: 'BLR', airport: 'Kempegowda Int\'l' },
    { name: 'Kolkata', code: 'CCU', airport: 'Netaji Subhas Chandra Bose' },
    { name: 'Hyderabad', code: 'HYD', airport: 'Rajiv Gandhi Int\'l' },
    { name: 'Chennai', code: 'MAA', airport: 'Chennai Int\'l' },
  ];

  const destinations = [
    { city: 'Delhi', route: 'JAI → DEL · 55 min', price: 'from ₹1,899', bg: 'bg1' },
    { city: 'Mumbai', route: 'JAI → BOM · 1h 55m', price: 'from ₹3,499', bg: 'bg2' },
    { city: 'Bengaluru', route: 'JAI → BLR · 2h 10m', price: 'from ₹4,199', bg: 'bg3' },
    { city: 'Kolkata', route: 'JAI → CCU · 2h 30m', price: 'from ₹4,890', bg: 'bg4' },
    { city: 'Hyderabad', route: 'JAI → HYD · 2h 5m', price: 'from ₹3,750', bg: 'bg5' },
    { city: 'Chennai', route: 'JAI → MAA · 2h 25m', price: 'from ₹4,620', bg: 'bg6' },
  ];

  const handleSwap = () => {
    setFromCity(toCity);
    setToCity(fromCity);
    setSwapped(!swapped);
  };

  const handleSearch = () => {
    setSearchParams({
      from: fromCity,
      to: toCity,
      date: departDate,
      travellers,
    });
    goto('results');
  };

  const getFromCityCode = () => {
    const city = cities.find(c => c.name === fromCity);
    return city ? city.code : 'JAI';
  };

  const getToCityCode = () => {
    const city = cities.find(c => c.name === toCity);
    return city ? city.code : 'BOM';
  };

  const features = [
    { icon: 'ti-shield-check', title: 'Secure payments', desc: '256-bit SSL encrypted, PCI-DSS compliant' },
    { icon: 'ti-headset', title: '24/7 support', desc: 'Call, chat, or email — always available' },
    { icon: 'ti-coin', title: 'Best price guarantee', desc: 'We match any lower fare you find' },
    { icon: 'ti-refresh', title: 'Free cancellation', desc: 'Cancel up to 24h before departure' },
  ];

  return (
    <>
      <div className="page">
        <div className="hero">
          <div className="hero-inner">
            <h1>Where do you<br />want to fly?</h1>
            <p className="hero-sub">Compare fares across 200+ airlines · Best price guarantee</p>
            <div className="search-box">
              <div className="trip-tabs">
                <button className="trip-tab active">One way</button>
                <button className="trip-tab">Round trip</button>
                <button className="trip-tab">Multi-city</button>
              </div>
              <div className="search-row">
                <div className="sf">
                  <label>From</label>
                  <div className="sf-input">
                    <i className="ti ti-map-pin"></i>
                    <div className="sf-val">Jaipur <small>JAI · Jaipur Int'l</small></div>
                  </div>
                </div>
                <button className="swap-btn" onClick={() => setSwapped(!swapped)} title="Swap cities">
                  <i className="ti ti-arrows-right-left" style={{ fontSize: '15px' }}></i>
                </button>
                <div className="sf">
                  <label>To</label>
                  <div className="sf-input">
                    <i className="ti ti-map-pin"></i>
                    <div className="sf-val">
                      {swapped ? 'Jaipur' : 'Mumbai'} <small>{swapped ? 'JAI · Jaipur Int\'l' : 'BOM · Chhatrapati Shivaji'}</small>
                    </div>
                  </div>
                </div>
                <div className="sf">
                  <label>Depart</label>
                  <div className="sf-input" id="depart-picker">
                    <i className="ti ti-calendar"></i>
                    <div className="sf-val">15 May 2026 <small>Friday</small></div>
                  </div>
                </div>
                <div className="sf">
                  <label>Travellers</label>
                  <div className="sf-input">
                    <i className="ti ti-users"></i>
                    <div className="sf-val">
                      <select className="sf-val" style={{ width: '100%' }}>
                        <option>1 Adult · Economy</option>
                        <option>2 Adults · Economy</option>
                        <option>1 Adult · Business</option>
                        <option>Family (4)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button className="btn-search" onClick={() => goto('results')}>
                  <i className="ti ti-search"></i>Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-head">
            <h2>Popular routes from Jaipur</h2>
            <p>Updated daily — best fares guaranteed</p>
          </div>
          <div className="dest-grid">
            {destinations.map((dest, idx) => (
              <div key={idx} className="dest-card" onClick={() => goto('results')}>
                <div className={`dest-img ${dest.bg}`}>
                  <div className="dest-overlay"></div>
                  <span className="dest-city">{dest.city}</span>
                </div>
                <div className="dest-body">
                  <span className="dest-route">{dest.route}</span>
                  <span className="dest-price">{dest.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="features-strip">
          <div className="features-inner">
            {features.map((feat, idx) => (
              <div key={idx} className="feat">
                <i className={`ti ${feat.icon} feat-icon`}></i>
                <div>
                  <div className="feat-title">{feat.title}</div>
                  <div className="feat-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
