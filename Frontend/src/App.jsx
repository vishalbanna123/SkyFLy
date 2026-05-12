import { useEffect, useMemo, useState } from 'react';
import './index.css';

const tripTabs = ['One way', 'Round trip', 'Multi-city'];
const destinations = [
  { city: 'Delhi', route: 'JAI → DEL · 55 min', price: 'from ₹1,899', style: 'bg1' },
  { city: 'Mumbai', route: 'JAI → BOM · 1h 55m', price: 'from ₹3,499', style: 'bg2' },
  { city: 'Bengaluru', route: 'JAI → BLR · 2h 10m', price: 'from ₹4,199', style: 'bg3' },
  { city: 'Kolkata', route: 'JAI → CCU · 2h 30m', price: 'from ₹4,890', style: 'bg4' },
  { city: 'Hyderabad', route: 'JAI → HYD · 2h 5m', price: 'from ₹3,750', style: 'bg5' },
  { city: 'Chennai', route: 'JAI → MAA · 2h 25m', price: 'from ₹4,620', style: 'bg6' },
];
const features = [
  { icon: 'ti-shield-check', title: 'Secure payments', desc: '256-bit SSL encrypted, PCI-DSS compliant' },
  { icon: 'ti-headset', title: '24/7 support', desc: 'Call, chat, or email — always available' },
  { icon: 'ti-coin', title: 'Best price guarantee', desc: 'We match any lower fare you find' },
  { icon: 'ti-refresh', title: 'Free cancellation', desc: 'Cancel up to 24h before departure' },
];
const flights = [
  {
    airline: 'IndiGo', code: '6E 2108', label: '6E', logo: 'al-6e', depart: '06:10', arrive: '08:05', duration: '1h 55m', type: 'Nonstop', price: '₹3,890', oldPrice: '₹4,500', badge: 'Best value', product: 'Economy', baggage: '15 kg bag', refundable: true,
  },
  {
    airline: 'Air India', code: 'AI 445', label: 'AI', logo: 'al-ai', depart: '08:30', arrive: '10:35', duration: '2h 05m', type: 'Nonstop', price: '₹4,250', product: 'Economy', baggage: '25 kg bag', refundable: true,
  },
  {
    airline: 'Vistara', code: 'UK 695', label: 'UK', logo: 'al-uk', depart: '11:15', arrive: '13:35', duration: '2h 20m', type: 'Nonstop', price: '₹8,900', product: 'Business', baggage: '30 kg bag', refundable: true,
  },
  {
    airline: 'Air India', code: 'AI 879', label: 'AI', logo: 'al-ai', depart: '14:20', arrive: '18:10', duration: '3h 50m', type: '1 stop · DEL', price: '₹3,150', product: 'Economy', baggage: '15 kg bag', refundable: false,
  },
  {
    airline: 'SpiceJet', code: 'SG 434', label: 'SG', logo: 'al-sg', depart: '19:45', arrive: '21:45', duration: '2h 00m', type: 'Nonstop', price: '₹3,420', product: 'Economy', baggage: '15 kg bag', refundable: false,
  },
];
const bookings = [
  { status: 'Upcoming', variant: 'bk-upcoming', route: 'JAI → BOM', info: 'IndiGo · 6E 2108 · 15 May 2026 · Economy', price: '₹4,239', pnr: 'SF7K3M', action: 'View ticket' },
  { status: 'Completed', variant: 'bk-completed', route: 'JAI → DEL', info: 'Air India · AI 445 · 2 Mar 2026 · Economy', price: '₹2,150', pnr: 'AI2M9X', action: 'Download e-ticket' },
  { status: 'Cancelled', variant: 'bk-cancelled', route: 'JAI → BLR', info: 'IndiGo · 6E 5544 · 10 Jan 2026 · Economy', price: '₹4,199', pnr: '6E8VK1', action: 'Refund processed' },
];
const profileNavItems = ['My bookings', 'Profile details', 'Saved cards', 'Wishlist', 'Rewards & offers', 'Log out'];
const bankOptions = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'];
const walletOptions = ['Paytm Wallet', 'Amazon Pay', 'Mobikwik', 'Freecharge'];

function formatCardNumber(value) {
  const raw = value.replace(/\D/g, '').substring(0, 16);
  return raw.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const raw = value.replace(/\D/g, '').substring(0, 4);
  if (raw.length <= 2) return raw;
  return `${raw.substring(0, 2)}/${raw.substring(2)}`;
}

export default function App() {
  const [page, setPage] = useState('home');
  const [tripType, setTripType] = useState('One way');
  const [swapped, setSwapped] = useState(false);
  const [priceValue, setPriceValue] = useState(10000);
  const [durationValue, setDurationValue] = useState(360);
  const [activeTimes, setActiveTimes] = useState({ dawn: true, morning: true, afternoon: false, evening: false });
  const [sortBy, setSortBy] = useState('Cheapest');
  const [selectedPayMethod, setSelectedPayMethod] = useState('card');
  const [selectedUpi, setSelectedUpi] = useState('GPay');
  const [selectedBank, setSelectedBank] = useState('SBI');
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedProfileNav, setSelectedProfileNav] = useState('My bookings');
  const [promoCode, setPromoCode] = useState('');
  const [flightResults, setFlightResults] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('flysmart-user'));
    } catch {
      return null;
    }
  });
  const [profileData, setProfileData] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [authType, setAuthType] = useState('');
  const isLoggedIn = Boolean(user);
  const [bookingPassengerFirstName, setBookingPassengerFirstName] = useState('Rahul');
  const [bookingPassengerLastName, setBookingPassengerLastName] = useState('Sharma');
  const [bookingDob, setBookingDob] = useState('1995-05-15');
  const [bookingNationality, setBookingNationality] = useState('Indian');
  const [bookingPhone, setBookingPhone] = useState('+91 98765 43210');
  const [bookingEmail, setBookingEmail] = useState('rahul.sharma@example.com');
  const [bookingIdType, setBookingIdType] = useState('Aadhaar card');
  const [bookingIdNumber, setBookingIdNumber] = useState('123456789012');

  const destination = swapped ? 'Jaipur' : 'Mumbai';
  const destinationSub = swapped ? "JAI · Jaipur Int'l" : 'BOM · Chhatrapati Shivaji';
  const cardPreviewNumber = cardNumber || '•••• •••• •••• ••••';
  const cardPreviewName = cardName.toUpperCase() || 'YOUR NAME';
  const cardPreviewExpiry = cardExpiry || 'MM/YY';

  const seatRows = [1, 2, 3, 4, 5, 6];
  const seatCols = ['A', 'B', 'C', 'D', 'E', 'F'];
  const takenSeatIds = [11, 15, 18, 24, 28, 31, 34, 42];

  const seatMap = useMemo(
    () => seatRows.map((row) => (
      <div key={row} style={{ display: 'flex', gap: 4, marginBottom: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: 'var(--muted)', width: 16, textAlign: 'center' }}>{row}</span>
        {seatCols.map((col, index) => {
          const seatId = row * 10 + (index >= 3 ? index + 1 : index);
          const isGap = index === 3 ? false : false;
          if (index === 3) {
            return <div key={`${row}-${col}-gap`} style={{ width: 20 }} />;
          }
          const isTaken = takenSeatIds.includes(seatId);
          const isSelected = selectedSeat === seatId;
          const className = ['seat', isTaken ? 'taken' : isSelected ? 'selected' : 'free'].join(' ');
          return (
            <button
              key={`${row}-${col}`}
              type="button"
              className={className}
              onClick={() => !isTaken && setSelectedSeat(seatId)}
              style={{ width: 36, height: 32 }}
            >
              {row}
              {col}
            </button>
          );
        })}
      </div>
    )),
    [selectedSeat]
  );

  const currentFlights = flightResults.length ? flightResults : flights;
  const flightCount = currentFlights.length;
  const displayBookings = bookingData.length ? bookingData : bookings;
  const activeFlight = selectedFlight || currentFlights[0] || flights[0];
  const fromCode = swapped ? 'BOM' : 'JAI';
  const toCode = swapped ? 'JAI' : 'BOM';

  const loadUserProfile = async (email) => {
    try {
      const profileRes = await fetch(`/api/profile?email=${encodeURIComponent(email)}`);
      if (!profileRes.ok) throw new Error('Failed to load profile');
      const profileJson = await profileRes.json();
      setProfileData(profileJson);
      return profileJson;
    } catch (error) {
      console.error(error);
      setProfileData({ name: user?.name || 'Passenger', email: user?.email || '' });
      return profileData;
    }
  };

  const saveUser = (userData) => {
    setUser(userData);
    localStorage.setItem('flysmart-user', JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    setProfileData(null);
    setBookingData([]);
    localStorage.removeItem('flysmart-user');
    setSelectedProfileNav('My bookings');
  };

  const handleLogout = () => {
    clearUser();
    setPage('home');
    setAuthMessage('Logged out successfully.');
    setAuthType('login');
  };

  const handleProfileNav = (item) => {
    if (item === 'Log out') {
      handleLogout();
      return;
    }
    setSelectedProfileNav(item);
  };

  useEffect(() => {
    async function loadAppData() {
      try {
        setLoadingMessage('Loading app data...');
        const flightsRes = await fetch('/api/flights?from=JAI&to=BOM&date=2026-05-15');
        if (!flightsRes.ok) throw new Error('Flights load failed');
        const flightsJson = await flightsRes.json();
        setFlightResults(flightsJson);

        if (user?.email) {
          const [bookingsRes, profileRes] = await Promise.all([
            fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`),
            fetch(`/api/profile?email=${encodeURIComponent(user.email)}`),
          ]);

          if (bookingsRes.ok) {
            setBookingData(await bookingsRes.json());
          }
          if (profileRes.ok) {
            setProfileData(await profileRes.json());
          }
        }
      } catch (error) {
        console.error(error);
        setLoadingMessage('Unable to reach backend.');
      } finally {
        setTimeout(() => setLoadingMessage(''), 400);
      }
    }

    loadAppData();
  }, [user]);
  async function fetchFlights(from = 'JAI', to = 'BOM', date = '2026-05-15') {
    const params = new URLSearchParams({ from, to, date });
    setLoadingMessage('Searching flights...');
    try {
      const response = await fetch(`/api/flights?${params}`);
      if (!response.ok) throw new Error('Flight search failed');
      const results = await response.json();
      setFlightResults(results);
      return results;
    } catch (error) {
      console.error(error);
      setLoadingMessage('Flight search failed.');
      return [];
    } finally {
      setTimeout(() => setLoadingMessage(''), 400);
    }
  }

  const handleSearch = async () => {
    await fetchFlights(fromCode, toCode, '2026-05-15');
    setPage('results');
  };

  const handleSelectFlight = (flight) => {
    if (!isLoggedIn) {
      setPage('login');
      setAuthMessage('Login to continue booking flights.');
      setAuthType('error');
      return;
    }
    setSelectedFlight(flight);
    setPage('booking');
  };

  const handleLogin = async () => {
    setAuthMessage('Signing in...');
    setAuthType('login');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Login failed');
      const userData = { name: result.user.name, email: result.user.email };
      saveUser(userData);
      await loadUserProfile(userData.email);
      setAuthMessage(`Welcome back, ${result.user.name}!`);
      setLoginEmail('');
      setLoginPassword('');
      setPage('profile');
    } catch (error) {
      setAuthMessage(error.message);
      setAuthType('error');
    }
  };

  const handleSignup = async () => {
    setAuthMessage('Creating account...');
    setAuthType('signup');
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: signupName, email: signupEmail, password: signupPassword }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Signup failed');
      const userData = { name: result.user.name, email: result.user.email };
      saveUser(userData);
      await loadUserProfile(userData.email);
      setAuthMessage(`Welcome, ${result.user.name}! Your account is ready.`);
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
      setPage('profile');
    } catch (error) {
      setAuthMessage(error.message);
      setAuthType('error');
    }
  };

  const handleBookFlight = async () => {
    if (!isLoggedIn) {
      setPage('login');
      setAuthMessage('Please log in before booking flights.');
      setAuthType('error');
      return;
    }

    if (!activeFlight) return;
    setLoadingMessage('Confirming booking...');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: activeFlight.id || activeFlight.code.replace(/\s+/g, ''),
          passengerName: `${bookingPassengerFirstName} ${bookingPassengerLastName}`,
          email: user.email || bookingEmail,
          phone: bookingPhone,
          seat: selectedSeat ? `${selectedSeat}` : '14A',
          paymentMethod: selectedPayMethod,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Booking failed');
      setBookingData((prev) => [result.booking, ...prev]);
      setPage('confirmation');
    } catch (error) {
      setLoadingMessage(error.message);
    } finally {
      setTimeout(() => setLoadingMessage(''), 400);
    }
  };

  return (
    <div>
      <nav>
        <div className="brand" onClick={() => setPage('home')}>
          <i className="ti ti-plane"></i>
          <span className="brand-name">FlySmart</span>
        </div>
        <div className="nav-links">
          <div className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>Home</div>
          <div className={`nav-link ${page === 'results' ? 'active' : ''}`} onClick={() => setPage('results')}>Search Flights</div>
          <div className={`nav-link ${page === 'profile' ? 'active' : ''}`} onClick={() => isLoggedIn ? setPage('profile') : setPage('login')}>My Bookings</div>
          <div className="nav-link">Offers</div>
        </div>
        <div className="nav-right">
          {isLoggedIn ? (
            <button type="button" className="btn-profile" onClick={() => setPage('profile')}>
              <span className="profile-initials">{(user?.name || 'U').split(' ').map((part) => part[0]).join('').toUpperCase()}</span>
              <span>{user?.name || 'Profile'}</span>
            </button>
          ) : (
            <>
              <button type="button" className="btn-login" onClick={() => setPage('login')}>Log in</button>
              <button type="button" className="btn-signup" onClick={() => setPage('signup')}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      <div id="page-home" className={`page ${page === 'home' ? 'active' : ''}`}>
        <div className="hero">
          <div className="hero-inner">
            <h1>Where do you<br />want to fly?</h1>
            <p className="hero-sub">Compare fares across 200+ airlines · Best price guarantee</p>
            <div className="search-box">
              <div className="trip-tabs">
                {tripTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`trip-tab ${tripType === tab ? 'active' : ''}`}
                    onClick={() => setTripType(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="search-row">
                <div className="sf">
                  <label>From</label>
                  <div className="sf-input">
                    <i className="ti ti-map-pin"></i>
                    <div className="sf-val">
                      Jaipur <small>JAI · Jaipur Int&apos;l</small>
                    </div>
                  </div>
                </div>
                <button type="button" className="swap-btn" onClick={() => setSwapped((current) => !current)} title="Swap cities">
                  <i className="ti ti-arrows-right-left" style={{ fontSize: 15 }} />
                </button>
                <div className="sf">
                  <label>To</label>
                  <div className="sf-input">
                    <i className="ti ti-map-pin"></i>
                    <div className="sf-val">
                      {destination} <small>{destinationSub}</small>
                    </div>
                  </div>
                </div>
                <div className="sf">
                  <label>Depart</label>
                  <div className="sf-input" id="depart-picker">
                    <i className="ti ti-calendar"></i>
                    <div className="sf-val" id="depart-lbl">15 May 2026 <small>Friday</small></div>
                  </div>
                </div>
                <div className="sf">
                  <label>Travellers</label>
                  <div className="sf-input">
                    <i className="ti ti-users"></i>
                    <div className="sf-val">
                      <select style={{ width: '100%', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500, color: 'var(--text)' }}>
                        <option>1 Adult · Economy</option>
                        <option>2 Adults · Economy</option>
                        <option>1 Adult · Business</option>
                        <option>Family (4)</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button type="button" className="btn-search" onClick={handleSearch}>
                  <i className="ti ti-search" />Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-head"><h2>Popular routes from Jaipur</h2><p>Updated daily — best fares guaranteed</p></div>
          <div className="dest-grid">
            {destinations.map((dest) => (
              <div key={dest.city} className="dest-card" onClick={handleSearch}>
                <div className={`dest-img ${dest.style}`}>
                  <div className="dest-overlay" />
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
            {features.map((feat) => (
              <div key={feat.title} className="feat">
                <i className={`ti ${feat.icon} feat-icon`} />
                <div>
                  <div className="feat-title">{feat.title}</div>
                  <div className="feat-desc">{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer>
          <div className="footer-inner">
            <div>
              <div className="footer-brand"><i className="ti ti-plane" />FlySmart</div>
              <div className="footer-tagline">India&apos;s smartest way to book flights</div>
              <div style={{ fontSize: 12 }}>College project · Built with ❤️</div>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a>About us</a><a>Careers</a><a>Press</a><a>Blog</a>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <a>Help centre</a><a>Contact us</a><a>Cancellation</a><a>Baggage</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a>Privacy policy</a><a>Terms of service</a><a>Cookie policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 FlySmart Technologies Pvt Ltd · College Project Demo</span>
            <span>Made in Jaipur 🇮🇳</span>
          </div>
        </footer>
      </div>

      <div id="page-results" className={`page ${page === 'results' ? 'active' : ''}`}>
        <div style={{ background: '#0d2b47', padding: '1rem 2rem' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="sf-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', flex: '0 0 auto', cursor: 'pointer' }}>
              <i className="ti ti-map-pin" style={{ color: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>JAI → BOM</span>
            </div>
            <div className="sf-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', flex: '0 0 auto' }}>
              <i className="ti ti-calendar" style={{ color: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 13, color: '#fff' }}>15 May 2026</span>
            </div>
            <div className="sf-input" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', flex: '0 0 auto' }}>
              <i className="ti ti-users" style={{ color: 'rgba(255,255,255,0.6)' }} />
              <span style={{ fontSize: 13, color: '#fff' }}>1 Adult · Economy</span>
            </div>
            <button type="button" className="btn-search" style={{ marginLeft: 'auto' }} onClick={() => setPage('results')}>
              <i className="ti ti-refresh" />Modify
            </button>
          </div>
        </div>

        <div className="breadcrumb">
          <span role="button" onClick={() => setPage('home')}>Home</span>
          <i className="ti ti-chevron-right" />
          <span>Flight results</span>
        </div>

        <div className="results-layout">
          <div className="filter-panel">
            <div className="filter-title">Filters <span className="filter-reset" onClick={() => { setActiveTimes({ dawn: true, morning: true, afternoon: false, evening: false }); setPriceValue(10000); setDurationValue(360); }}>Reset all</span></div>
            <div className="filter-section">
              <h4>Stops</h4>
              <div className="filter-opt"><input type="checkbox" defaultChecked /><span>Nonstop only</span><small>(2)</small></div>
              <div className="filter-opt"><input type="checkbox" defaultChecked /><span>1 stop</span><small>(4)</small></div>
              <div className="filter-opt"><input type="checkbox" /><span>2+ stops</span><small>(1)</small></div>
            </div>
            <div className="filter-section">
              <h4>Price range</h4>
              <input type="range" className="range-slider" min="2000" max="12000" value={priceValue} onChange={(e) => setPriceValue(Number(e.target.value))} />
              <div className="range-val">Up to <strong>₹{priceValue.toLocaleString('en-IN')}</strong></div>
            </div>
            <div className="filter-section">
              <h4>Departure time</h4>
              <div className="time-grid">
                {['dawn', 'morning', 'afternoon', 'evening'].map((key) => {
                  const label = key === 'dawn' ? '00–06' : key === 'morning' ? '06–12' : key === 'afternoon' ? '12–18' : '18–24';
                  const sub = key === 'dawn' ? 'Dawn' : key === 'morning' ? 'Morning' : key === 'afternoon' ? 'Afternoon' : 'Evening';
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`time-pill ${activeTimes[key] ? 'active' : ''}`}
                      onClick={() => setActiveTimes((prev) => ({ ...prev, [key]: !prev[key] }))}
                    >
                      {label}<br /><small>{sub}</small>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="filter-section">
              <h4>Airlines</h4>
              <div className="filter-opt"><input type="checkbox" defaultChecked /><span>Air India</span><small>(3)</small></div>
              <div className="filter-opt"><input type="checkbox" defaultChecked /><span>IndiGo</span><small>(5)</small></div>
              <div className="filter-opt"><input type="checkbox" defaultChecked /><span>Vistara</span><small>(2)</small></div>
              <div className="filter-opt"><input type="checkbox" /><span>SpiceJet</span><small>(2)</small></div>
            </div>
            <div className="filter-section">
              <h4>Duration</h4>
              <input type="range" className="range-slider" min="60" max="480" value={durationValue} onChange={(e) => setDurationValue(Number(e.target.value))} />
              <div className="range-val">Up to <strong>{Math.floor(durationValue / 60)}h {durationValue % 60 === 0 ? '00' : durationValue % 60}m</strong></div>
            </div>
            <div className="filter-section">
              <h4>Fare type</h4>
              {['All fares', 'Refundable only', 'Student fare'].map((fare) => (
                <div key={fare} className="filter-opt">
                  <input type="radio" name="fare" checked={sortBy === fare} onChange={() => setSortBy(fare)} />
                  <span>{fare}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="results-panel">
            <div className="results-bar">
              <div className="results-info"><strong>JAI → BOM</strong> · 15 May · <strong>{flightCount} flights</strong> found</div>
              <div className="sort-row">
                {['Cheapest', 'Fastest', 'Earliest'].map((option) => (
                  <button type="button" key={option} className={`sort-btn ${sortBy === option ? 'active' : ''}`} onClick={() => setSortBy(option)}>{option}</button>
                ))}
              </div>
            </div>
            {currentFlights.map((flight) => (
              <div key={flight.code} className={`flight-card ${flight.badge ? 'best' : ''}`} onClick={() => handleSelectFlight(flight)}>
                <div>
                  {flight.badge && <div className="best-tag">{flight.badge}</div>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div className={`al-logo ${flight.logo}`}>{flight.label}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{flight.airline}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)' }}>{flight.code}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="fc-time">{flight.depart}</div>
                  <div className="fc-code">JAI</div>
                </div>
                <div className="fc-dur">
                  <div className="dur-line"><div className="dl-dot" /><div className="dl-seg" /><i className="ti ti-plane dl-plane" /><div className="dl-seg" /><div className="dl-dot" /></div>
                  <div className="dur-text">{flight.duration}</div>
                  <span className={`stop-badge ${flight.type.includes('stop') ? 'os' : 'ns'}`}>{flight.type}</span>
                </div>
                <div>
                  <div className="fc-time">{flight.arrive}</div>
                  <div className="fc-code">BOM</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {flight.product}<br />{flight.baggage}<br />
                  <span style={{ color: flight.refundable ? '#2d7a3a' : 'var(--danger)', fontSize: 11 }}>{flight.refundable ? '✓ Refundable' : '✗ Non-refundable'}</span>
                </div>
                <div className="fc-price">
                  {flight.oldPrice && <div className="old">{flight.oldPrice}</div>}
                  <div className="price">{flight.price}</div>
                  <div className="per">per person</div>
                  <button type="button" className="btn-book" onClick={(event) => { event.stopPropagation(); handleSelectFlight(flight); }}>Select →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="page-booking" className={`page ${page === 'booking' ? 'active' : ''}`}>
        <div className="breadcrumb">
          <span role="button" onClick={() => setPage('home')}>Home</span><i className="ti ti-chevron-right" />
          <span role="button" onClick={() => setPage('results')}>Results</span><i className="ti ti-chevron-right" />
          <span style={{ color: 'var(--sky)' }}>Passenger details</span>
        </div>

        <div className="booking-page">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>1</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sky)' }}>Passenger details</span>
            </div>
            <div style={{ flex: 1, height: 2, background: '#dce3ea' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dce3ea', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>2</div>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Seat selection</span>
            </div>
            <div style={{ flex: 1, height: 2, background: '#dce3ea' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#dce3ea', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>3</div>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>Payment</span>
            </div>
          </div>

          <div className="booking-grid">
            <div>
              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head">
                  <i className="ti ti-user" />
                  <h3>Passenger 1</h3>
                  <span>Adult</span>
                </div>
                <div className="form-body">
                  <div className="form-row cols3">
                    <div className="form-group">
                      <label>Title</label>
                      <select><option>Mr</option><option>Mrs</option><option>Ms</option><option>Dr</option></select>
                    </div>
                    <div className="form-group">
                      <label>First name</label>
                      <input type="text" placeholder="As on ID card" />
                    </div>
                    <div className="form-group">
                      <label>Last name</label>
                      <input type="text" placeholder="As on ID card" />
                    </div>
                  </div>
                  <div className="form-row cols2">
                    <div className="form-group">
                      <label>Date of birth</label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Nationality</label>
                      <select><option>Indian</option><option>American</option><option>British</option><option>Other</option></select>
                    </div>
                  </div>
                  <div className="form-row cols2">
                    <div className="form-group">
                      <label>Mobile number</label>
                      <input type="tel" placeholder="+91 00000 00000" />
                    </div>
                    <div className="form-group">
                      <label>Email address</label>
                      <input type="email" placeholder="you@example.com" />
                    </div>
                  </div>
                  <hr className="divider" />
                  <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Government-issued photo ID (for domestic flights)</p>
                  <div className="form-row cols2">
                    <div className="form-group">
                      <label>ID type</label>
                      <select><option>Aadhaar card</option><option>PAN card</option><option>Passport</option><option>Driving licence</option></select>
                    </div>
                    <div className="form-group">
                      <label>ID number</label>
                      <input type="text" placeholder="Enter ID number" />
                    </div>
                  </div>
                </div>
              </div>

              <button type="button" className="add-pax" onClick={() => window.alert('Passenger 2 form would expand here')}>
                <i className="ti ti-plus" style={{ fontSize: 16 }} /> Add another passenger
              </button>

              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head">
                  <i className="ti ti-armchair" />
                  <h3>Select your seat</h3>
                  <span style={{ cursor: 'pointer', textDecoration: 'underline', opacity: 0.7 }} onClick={() => window.alert('Skip seat')}>Skip</span>
                </div>
                <div className="form-body">
                  <div style={{ display: 'flex', gap: '2rem', marginBottom: 12, fontSize: 12, color: 'var(--muted)' }}>
                    <span>✈ IndiGo 6E 2108 · JAI → BOM · Boeing 737</span>
                  </div>
                  <div style={{ maxWidth: 320, margin: '0 auto' }}>
                    <div style={{ display: 'flex', gap: 4, marginBottom: 4, justifyContent: 'center' }}>
                      {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
                        <div key={col} style={{ width: 36, textAlign: 'center', fontSize: 10, color: 'var(--muted)' }}>{col}</div>
                      ))}
                    </div>
                    <div id="seat-map">{seatMap}</div>
                  </div>
                  <div className="seat-legend">
                    <span><div className="seat-dot" style={{ background: '#eaf6ec', border: '1px solid #b8e2c0' }} />Available</span>
                    <span><div className="seat-dot" style={{ background: '#f0f0f0', border: '1px solid #e0e0e0' }} />Taken</span>
                    <span><div className="seat-dot" style={{ background: 'var(--sky)' }} />Selected</span>
                  </div>
                </div>
              </div>

              <div className="form-card" style={{ marginBottom: '1rem' }}>
                <div className="form-card-head"><i className="ti ti-backpack" /><h3>Add-ons & extras</h3></div>
                <div className="form-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Extra baggage — 5 kg</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Add up to 20 kg checked baggage</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 13, color: 'var(--sky)', fontWeight: 600 }}>₹650</span><input type="checkbox" style={{ accentColor: 'var(--sky)' }} /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Travel insurance</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Covers cancellation, delay & medical</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 13, color: 'var(--sky)', fontWeight: 600 }}>₹349</span><input type="checkbox" style={{ accentColor: 'var(--sky)' }} /></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>Meal preference</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>Veg / Non-veg / Jain</div>
                    </div>
                    <select style={{ border: '1px solid #dce3ea', borderRadius: 6, padding: '6px 10px', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--text)' }}>
                      <option>No preference</option><option>Vegetarian</option><option>Non-vegetarian</option><option>Jain</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-search" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }} onClick={() => setPage('payment')}>Continue to payment →</button>
            </div>

            <div className="order-card">
              <div className="order-head"><h3>Booking summary</h3></div>
              <div className="flight-summary">
                <div className="fs-route">
                  <span className="fs-city">{activeFlight.from || 'JAI'}</span>
                  <i className="ti ti-arrow-right fs-arrow" />
                  <span className="fs-city">{activeFlight.to || 'BOM'}</span>
                  <span className="tag tag-info" style={{ marginLeft: 'auto' }}>{activeFlight.type || 'Nonstop'}</span>
                </div>
                <div className="fs-details">
                  {activeFlight.airline} · {activeFlight.code}<br />
                  {activeFlight.date || '15 May 2026'} · {activeFlight.depart} – {activeFlight.arrive}<br />
                  {activeFlight.product} · 1 Adult<br />
                  Seat: {selectedSeat ? `${selectedSeat} (selected)` : '14A (window)'}
                </div>
              </div>
              <div className="price-breakdown">
                <div className="pb-row"><span>Base fare (1 adult)</span><span>₹3,290</span></div>
                <div className="pb-row"><span>Taxes & fees</span><span>₹600</span></div>
                <div className="pb-row"><span>Seat charge</span><span>₹200</span></div>
                <div className="pb-row"><span>Convenience fee</span><span>₹149</span></div>
                <div className="pb-row total"><span>Total payable</span><span>₹4,239</span></div>
              </div>
              <div className="promo-row">
                <input className="promo-input" placeholder="Promo / coupon code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                <button type="button" className="btn-apply">Apply</button>
              </div>
              <button type="button" className="pay-btn" onClick={() => setPage('payment')}>Proceed to pay ₹4,239</button>
              <p className="secure-note"><i className="ti ti-lock" style={{ fontSize: 14 }} />100% secure · SSL encrypted</p>
            </div>
          </div>
        </div>
      </div>

      <div id="page-payment" className={`page ${page === 'payment' ? 'active' : ''}`}>
        <div className="breadcrumb">
          <span role="button" onClick={() => setPage('home')}>Home</span><i className="ti ti-chevron-right" />
          <span role="button" onClick={() => setPage('results')}>Results</span><i className="ti ti-chevron-right" />
          <span role="button" onClick={() => setPage('booking')}>Passenger details</span><i className="ti ti-chevron-right" />
          <span style={{ color: 'var(--sky)' }}>Payment</span>
        </div>

        <div className="payment-page">
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2d7a3a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}><i className="ti ti-check" style={{ fontSize: 14 }} /></div>
              <span style={{ fontSize: 13, color: '#2d7a3a' }}>Passenger details</span>
            </div>
            <div style={{ flex: 1, height: 2, background: '#2d7a3a' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#2d7a3a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}><i className="ti ti-check" style={{ fontSize: 14 }} /></div>
              <span style={{ fontSize: 13, color: '#2d7a3a' }}>Seat selection</span>
            </div>
            <div style={{ flex: 1, height: 2, background: 'var(--sky)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--sky)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>3</div>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--sky)' }}>Payment</span>
            </div>
          </div>

          <div className="payment-grid">
            <div>
              <div className="form-card">
                <div className="form-card-head"><i className="ti ti-credit-card" /><h3>Choose payment method</h3></div>
                <div className="form-body">
                  <div className="pay-methods">
                    {[
                      { value: 'card', label: 'Credit / Debit card', icon: 'ti-credit-card' },
                      { value: 'upi', label: 'UPI', icon: 'ti-qrcode' },
                      { value: 'nb', label: 'Net banking', icon: 'ti-building-bank' },
                      { value: 'wallet', label: 'Wallets', icon: 'ti-wallet' },
                    ].map((method) => (
                      <button type="button" key={method.value} className={`pay-method ${selectedPayMethod === method.value ? 'active' : ''}`} onClick={() => setSelectedPayMethod(method.value)}>
                        <i className={`ti ${method.icon}`} />{method.label}
                      </button>
                    ))}
                  </div>

                  {selectedPayMethod === 'card' && (
                    <div id="pay-card">
                      <div className="card-preview">
                        <div className="card-chip" />
                        <div className="card-number" id="card-num-preview">{cardPreviewNumber}</div>
                        <div className="card-row">
                          <div>
                            <div style={{ fontSize: 10, opacity: 0.6 }}>CARD HOLDER</div>
                            <div className="card-name" id="card-name-preview">{cardPreviewName}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 10, opacity: 0.6 }}>VALID THRU</div>
                            <div className="card-name" id="card-exp-preview">{cardPreviewExpiry}</div>
                          </div>
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Card number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="form-row cols3">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label>Name on card</label>
                          <input value={cardName} onChange={(e) => setCardName(e.target.value)} type="text" placeholder="As on card" />
                        </div>
                        <div className="form-group">
                          <label>Expiry</label>
                          <input value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} type="text" placeholder="MM/YY" maxLength={5} />
                        </div>
                      </div>
                      <div className="form-row cols2">
                        <div className="form-group"><label>CVV</label><input type="password" placeholder="•••" maxLength={4} /></div>
                        <div className="form-group">
                          <label>Save card?</label>
                          <select><option>Don't save</option><option>Save for future use</option></select>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayMethod === 'upi' && (
                    <div id="pay-upi">
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Pay using any UPI app</p>
                      <div className="upi-logos">
                        {['GPay', 'Paytm', 'PhonePe', 'BHIM'].map((option) => (
                          <button type="button" key={option} className={`upi-logo ${option === 'GPay' ? 'gpay' : option === 'Paytm' ? 'paytm' : option === 'PhonePe' ? 'phonePe' : ''} ${selectedUpi === option ? 'active' : ''}`} onClick={() => setSelectedUpi(option)}>
                            {option}
                          </button>
                        ))}
                      </div>
                      <div className="form-group">
                        <label>Or enter UPI ID</label>
                        <input type="text" placeholder="yourname@upi" />
                      </div>
                    </div>
                  )}

                  {selectedPayMethod === 'nb' && (
                    <div id="pay-nb">
                      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12 }}>Select your bank</p>
                      <div className="payment-availability">
                        {bankOptions.map((bank) => (
                          <button type="button" key={bank} className={`time-pill ${selectedBank === bank ? 'active' : ''}`} style={{ padding: 10 }} onClick={() => setSelectedBank(bank)}>{bank}</button>
                        ))}
                      </div>
                      <div className="form-group">
                        <label>Or search your bank</label>
                        <input type="text" placeholder="Type bank name..." />
                      </div>
                    </div>
                  )}

                  {selectedPayMethod === 'wallet' && (
                    <div id="pay-wallet">
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
                        {walletOptions.map((wallet) => (
                          <button type="button" key={wallet} className={`time-pill ${selectedWallet === wallet ? 'active' : ''}`} style={{ padding: 12, fontSize: 12 }} onClick={() => setSelectedWallet(wallet)}>{wallet}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button type="button" className="btn-search" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15, marginTop: 24, borderRadius: 10 }} onClick={handleBookFlight}>
                    <i className="ti ti-lock" />Pay securely ₹4,239
                  </button>
                  <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
                    <i className="ti ti-shield-check" style={{ fontSize: 14, color: '#2d7a3a' }} />256-bit SSL · PCI-DSS compliant · Safe checkout
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="order-card" style={{ position: 'static' }}>
                <div className="order-head"><h3>Order summary</h3></div>
                <div className="flight-summary">
                  <div className="fs-route">
                    <span className="fs-city">{activeFlight.from || 'JAI'}</span>
                    <i className="ti ti-arrow-right fs-arrow" />
                    <span className="fs-city">{activeFlight.to || 'BOM'}</span>
                    <span className="tag tag-info" style={{ marginLeft: 'auto' }}>{activeFlight.type || 'Nonstop'}</span>
                  </div>
                  <div className="fs-details">
                    {activeFlight.airline} {activeFlight.code} · {activeFlight.date || '15 May 2026'}<br />
                    {activeFlight.depart} → {activeFlight.arrive} · {activeFlight.duration}<br />
                    {activeFlight.product} · Seat {selectedSeat || '14A'}
                  </div>
                </div>
                <div className="price-breakdown">
                  <div className="pb-row"><span>Base fare</span><span>₹3,290</span></div>
                  <div className="pb-row"><span>Taxes & fees</span><span>₹600</span></div>
                  <div className="pb-row"><span>Seat + extras</span><span>₹200</span></div>
                  <div className="pb-row"><span>Convenience fee</span><span>₹149</span></div>
                  <div className="pb-row total"><span>Total</span><span>₹4,239</span></div>
                </div>
                <div style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ background: '#eaf6ec', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <i className="ti ti-check" style={{ color: '#2d7a3a', marginTop: 1 }} />
                    <div style={{ fontSize: 12, color: '#2d7a3a', lineHeight: 1.6 }}>Refundable ticket · Free cancellation up to 24h before departure · Instant e-ticket on email</div>
                  </div>
                </div>
              </div>
              <div className="form-card" style={{ marginTop: 12 }}>
                <div className="form-card-head" style={{ background: '#0d2b47' }}><i className="ti ti-tag" /><h3>Applied offers</h3></div>
                <div className="form-body" style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, background: '#fdf3e0', borderRadius: 8 }}>
                    <i className="ti ti-discount-2" style={{ color: '#9a5d0a', fontSize: 18 }} />
                    <div style={{ fontSize: 12 }}>
                      <div style={{ fontWeight: 600, color: '#9a5d0a' }}>FIRST10 applied</div>
                      <div style={{ color: 'var(--muted)' }}>You saved ₹0 on this booking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="page-confirmation" className={`page ${page === 'confirmation' ? 'active' : ''}`}>
        <div className="confirm-page">
          <div className="confirm-icon"><i className="ti ti-check" /></div>
          <h1 className="confirm-title">Booking confirmed!</h1>
          <p className="confirm-sub">Your e-ticket has been sent to rahul.sharma@example.com · Check your inbox</p>
          <div className="pnr-box">
            <div className="pnr-label">YOUR PNR NUMBER</div>
            <div className="pnr-code">SF7K3M</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>Keep this safe — you&apos;ll need it at the airport</div>
          </div>
          <div className="ticket-card">
            <div className="ticket-head">
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>IndiGo · 6E 2108</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Economy · Boeing 737-800</div>
              </div>
              <span className="tag tag-info">Nonstop · 1h 55m</span>
            </div>
            <div className="ticket-body">
              <div>
                <div className="tkt-time">06:10</div>
                <div className="tkt-city">JAI — Jaipur</div>
              </div>
              <div className="tkt-dur">
                <div className="dur-line" style={{ justifyContent: 'center' }}><div className="dl-dot" /><div className="dl-seg" /><i className="ti ti-plane dl-plane" /><div className="dl-seg" /><div className="dl-dot" /></div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>1h 55m</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="tkt-time">08:05</div>
                <div className="tkt-city">BOM — Mumbai</div>
              </div>
            </div>
            <div className="tkt-date-row">
              <div><span className="tkt-meta">Date: </span><span className="tkt-val">Thursday, 15 May 2026</span></div>
              <div><span className="tkt-meta">Seat: </span><span className="tkt-val">14A (Window)</span></div>
              <div><span className="tkt-meta">Baggage: </span><span className="tkt-val">15 kg</span></div>
            </div>
            <div className="ticket-footer">
              <div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Passenger</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Rahul Sharma</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Total paid</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--sky)' }}>₹4,239</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn-search" onClick={() => window.alert('Downloading e-ticket PDF...')}><i className="ti ti-download" />Download e-ticket</button>
            <button type="button" style={{ padding: '12px 24px', border: '1px solid var(--sky)', borderRadius: 8, color: 'var(--sky)', background: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => window.alert('Opening calendar...')}><i className="ti ti-calendar-plus" />Add to calendar</button>
            <button type="button" style={{ padding: '12px 24px', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--muted)', background: '#fff', fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 8 }} onClick={() => window.alert('Sharing...')}><i className="ti ti-share" />Share</button>
          </div>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: '1rem' }}>What&apos;s next?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: 'ti-mail', title: 'Check your email', description: 'E-ticket sent to rahul.sharma@example.com' },
                { icon: 'ti-clock', title: 'Web check-in opens', description: 'Available 48h before departure · 14 May from 06:10' },
                { icon: 'ti-map-2', title: 'Arrive at airport', description: 'Jaipur International — 2h before departure (by 04:10)' },
              ].map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sky-light)', color: 'var(--sky)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}><i className={`ti ${item.icon}`} /></div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="btn-search" style={{ marginTop: '1.5rem', padding: '12px 32px' }} onClick={() => setPage('home')}><i className="ti ti-home" />Back to home</button>
        </div>
      </div>

      <div id="page-profile" className={`page ${page === 'profile' ? 'active' : ''}`}>
        {isLoggedIn ? (
          <div className="profile-page">
            <div className="profile-grid">
              <div className="profile-sidebar">
                <div className="avatar">{profileData ? profileData.name.split(' ').map((part) => part[0]).join('') : 'RS'}</div>
                <div className="profile-name">{profileData?.name || user?.name || 'Profile'}</div>
                <div className="profile-email">{profileData?.email || user?.email || ''}</div>
                <ul className="profile-nav">
                  {profileNavItems.map((item) => (
                    <li key={item} className={selectedProfileNav === item ? 'active' : ''} onClick={() => handleProfileNav(item)}>
                      <i className="ti ti-ticket" />{item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="section-head" style={{ marginBottom: '1rem' }}><h2>My bookings</h2><p>{displayBookings.length} bookings · {displayBookings.some((booking) => booking.status === 'Upcoming') ? '1 upcoming' : 'No upcoming'}</p></div>
                <div className="booking-list">
                  {displayBookings.map((booking) => (
                    <div key={booking.pnr} className="bk-card">
                      <div>
                        <span className={`bk-status ${booking.variant}`}>{booking.status}</span>
                        <div className="bk-route">{booking.route}</div>
                        <div className="bk-info">{booking.info}</div>
                        <div style={{ marginTop: 6, display: 'flex', gap: 8 }}>
                          <button type="button" className="sort-btn" onClick={() => booking.action.includes('View') ? setPage('confirmation') : window.alert(booking.action)}>{booking.action}</button>
                        </div>
                      </div>
                      <div />
                      <div>
                        <div className="bk-price" style={booking.variant === 'bk-cancelled' ? { textDecoration: 'line-through', color: 'var(--muted)' } : {}}>{booking.price}</div>
                        <div className="bk-pnr">PNR: {booking.pnr}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="auth-page">
            <div className="auth-box">
              <div className="auth-logo"><i className="ti ti-plane" /><span>FlySmart</span></div>
              <h2 className="auth-title">Welcome back</h2>
              <p className="auth-sub">Please log in to view your profile and book flights.</p>
              <button type="button" className="auth-submit" onClick={() => setPage('login')}>Log in</button>
            </div>
          </div>
        )}
      </div>

      <div id="page-login" className={`page ${page === 'login' ? 'active' : ''}`}>
        <div className="auth-page">
          <div className="auth-box">
            <div className="auth-logo"><i className="ti ti-plane" /><span>FlySmart</span></div>
            <h2 className="auth-title">Welcome back</h2>
            <p className="auth-sub">Log in to manage your bookings</p>
            <div className="auth-social">
              <button type="button" className="btn-social"><i className="ti ti-brand-google" style={{ color: '#4285f4' }} />Google</button>
              <button type="button" className="btn-social"><i className="ti ti-brand-facebook" style={{ color: '#1877f2' }} />Facebook</button>
            </div>
            <div className="auth-divider">or continue with email</div>
            <div className="auth-form">
              <div className="form-group"><label>Email address</label><input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} type="email" placeholder="you@example.com" /></div>
              <div className="form-group"><label>Password</label><input value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} type="password" placeholder="••••••••" /></div>
              <div style={{ textAlign: 'right', marginTop: -6 }}><a style={{ fontSize: 12, color: 'var(--sky)', cursor: 'pointer', textDecoration: 'none' }}>Forgot password?</a></div>
              <button type="button" className="auth-submit" onClick={handleLogin}>Log in</button>
              {authMessage && <p style={{ marginTop: 10, color: authType === 'error' ? '#ff6b6b' : '#2d7a3a', fontSize: 13 }}>{authMessage}</p>}
            </div>
            <p className="auth-switch">Don't have an account? <a onClick={() => setPage('signup')}>Sign up</a></p>
          </div>
        </div>
      </div>

      <div id="page-signup" className={`page ${page === 'signup' ? 'active' : ''}`}>
        <div className="auth-page">
          <div className="auth-box">
            <div className="auth-logo"><i className="ti ti-plane" /><span>FlySmart</span></div>
            <h2 className="auth-title">Create account</h2>
            <p className="auth-sub">Join millions of smart travellers</p>
            <div className="auth-social">
              <button type="button" className="btn-social"><i className="ti ti-brand-google" style={{ color: '#4285f4' }} />Google</button>
              <button type="button" className="btn-social"><i className="ti ti-brand-facebook" style={{ color: '#1877f2' }} />Facebook</button>
            </div>
            <div className="auth-divider">or fill in the form</div>
            <div className="auth-form">
              <div className="form-row cols2" style={{ gap: 10 }}>
                <div className="form-group"><label>First name</label><input value={signupName.split(' ')[0] || ''} onChange={(e) => setSignupName(`${e.target.value} ${signupName.split(' ')[1] || ''}`)} type="text" placeholder="Rahul" /></div>
                <div className="form-group"><label>Last name</label><input value={signupName.split(' ')[1] || ''} onChange={(e) => setSignupName(`${signupName.split(' ')[0] || ''} ${e.target.value}`)} type="text" placeholder="Sharma" /></div>
              </div>
              <div className="form-group"><label>Email address</label><input value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} type="email" placeholder="you@example.com" /></div>
              <div className="form-group"><label>Mobile number</label><input type="tel" placeholder="+91 00000 00000" /></div>
              <div className="form-group"><label>Password</label><input value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} type="password" placeholder="Minimum 8 characters" /></div>
              <div className="form-group"><label>Confirm password</label><input type="password" placeholder="Repeat password" /></div>
              <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 12, color: 'var(--muted)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ marginTop: 2, accentColor: 'var(--sky)' }} />
                I agree to the <a style={{ color: 'var(--sky)' }}>Terms of Service</a> and <a style={{ color: 'var(--sky)' }}>Privacy Policy</a>
              </label>
              <button type="button" className="auth-submit" onClick={handleSignup}>Create account</button>
              {authMessage && <p style={{ marginTop: 10, color: authType === 'error' ? '#ff6b6b' : '#2d7a3a', fontSize: 13 }}>{authMessage}</p>}
            </div>
            <p className="auth-switch">Already have an account? <a onClick={() => setPage('login')}>Log in</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
