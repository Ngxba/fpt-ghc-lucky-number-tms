import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [activeTab, setActiveTab] = useState('accounts');
  const [accounts, setAccounts] = useState([]);
  const [message, setMessage] = useState(null);

  // Account form state
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  // Ticket form state
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');
  const [accountSearchQuery, setAccountSearchQuery] = useState('');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('ticket');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch(`${API_URL}/accounts`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setAccounts(data);
      } else {
        console.error('Failed to fetch accounts:', data);
        setAccounts([]);
        showMessage('Unable to connect to database. Please check server logs.', 'error');
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
      setAccounts([]);
      showMessage('Unable to connect to server. Please try again later.', 'error');
    }
  };

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 5000);
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#FF6B6B', '#FFD93D', '#4ECDC4', '#A78BFA']
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Account Management
  const handleCreateAccount = async (e) => {
    e.preventDefault();

    if (!accountNumber.trim()) {
      showMessage('Please enter an account number', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/accounts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber: accountNumber.trim(),
          name: accountName.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setAccountNumber('');
        setAccountName('');
        await fetchAccounts();
        showMessage('Account created successfully!', 'success');
        triggerConfetti();
      } else {
        showMessage(data.error || 'Failed to create account', 'error');
      }
    } catch (error) {
      showMessage('Error creating account', 'error');
    }
  };

  // Ticket Management
  const handleAddTicket = async (e) => {
    e.preventDefault();

    if (!selectedAccountId) {
      showMessage('Please select an account', 'error');
      return;
    }

    if (!ticketNumber.trim()) {
      showMessage('Please enter a ticket number', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccountId,
          ticketNumber: ticketNumber.trim()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTicketNumber('');
        await fetchAccounts();
        showMessage('Ticket added successfully!', 'success');
        triggerConfetti();
      } else {
        showMessage(data.error || 'Failed to add ticket', 'error');
      }
    } catch (error) {
      showMessage('Error adding ticket', 'error');
    }
  };

  const handleRemoveTicket = async (accountId, ticketNumber) => {
    try {
      const response = await fetch(`${API_URL}/tickets/${accountId}/${ticketNumber}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        await fetchAccounts();
        showMessage('Ticket removed successfully!', 'success');
      } else {
        showMessage(data.error || 'Failed to remove ticket', 'error');
      }
    } catch (error) {
      showMessage('Error removing ticket', 'error');
    }
  };

  const handleCheckDuplicate = async () => {
    if (!ticketNumber.trim()) {
      showMessage('Please enter a ticket number to check', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tickets/check/${ticketNumber.trim()}`);
      const data = await response.json();

      if (data.exists) {
        showMessage(
          `Ticket ${ticketNumber} is assigned to ${data.account.name || data.account.accountNumber}`,
          'info'
        );
      } else {
        showMessage(`Ticket ${ticketNumber} is available!`, 'success');
      }
    } catch (error) {
      showMessage('Error checking ticket', 'error');
    }
  };

  // Search
  const handleSearch = async (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      showMessage('Please enter a search query', 'error');
      return;
    }

    try {
      const endpoint = searchType === 'ticket'
        ? `${API_URL}/search/ticket/${searchQuery.trim()}`
        : `${API_URL}/search/account/${searchQuery.trim()}`;

      const response = await fetch(endpoint);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data);
        if (searchType === 'ticket' && !data.account) {
          showMessage('No account found for this ticket', 'info');
        } else if (searchType === 'account' && data.tickets.length === 0) {
          showMessage('No tickets found for this account', 'info');
        }
      } else {
        showMessage(data.error || 'Search failed', 'error');
        setSearchResults(null);
      }
    } catch (error) {
      showMessage('Error performing search', 'error');
      setSearchResults(null);
    }
  };

  return (
    <div className="app">
      {/* Floating Confetti Background */}
      <div className="confetti-bg">
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
        <div className="confetti-piece"></div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-top">
            <div className="header-left">
              <div className="logos-container">
                <div className="fpt-logo">
                  <img
                    src="/fpt_logo.png"
                    alt="FPT Software"
                    className="fpt-logo-img"
                  />
                </div>
                <div className="ghc-logo">
                  <img
                    src="/ghc_logo.PNG"
                    alt="GHC"
                    className="ghc-logo-img"
                  />
                </div>
              </div>
            </div>
            <div className="header-title-group">
              <h1 className="logo">✨ Lucky Draw</h1>
              <p className="tagline">Where celebrations begin</p>
            </div>
            <div className="header-right"></div>
          </div>

          <nav className="nav">
            <button
              className={`nav-btn ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => setActiveTab('accounts')}
            >
              🎫 Accounts
            </button>
            <button
              className={`nav-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              🎟️ Tickets
            </button>
            <button
              className={`nav-btn ${activeTab === 'search' ? 'active' : ''}`}
              onClick={() => setActiveTab('search')}
            >
              🔍 Search
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Messages */}
        {message && (
          <div className={`message message-${message.type}`}>
            <span>{message.type === 'success' ? '✓' : message.type === 'error' ? '✕' : 'ℹ'}</span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <section className="section">
            <h2 className="section-title">Account Management</h2>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon" style={{ background: 'linear-gradient(135deg, #FF6B6B, #A78BFA)' }}>
                  ➕
                </span>
                Create New Account
              </h3>

              <form onSubmit={handleCreateAccount}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Account Number *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., ACC001"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Name (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g., John Doe"
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  🎉 Create Account
                </button>
              </form>
            </div>

            {/* Account List */}
            {accounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🎭</div>
                <p className="empty-state-text">No accounts yet. Create your first one!</p>
              </div>
            ) : (
              <div className="account-list">
                {accounts.map((account) => (
                  <div key={account._id} className="account-card">
                    <div className="account-number">{account.accountNumber}</div>
                    {account.name && <div className="account-name">{account.name}</div>}

                    <div className="account-tickets">
                      <div className="tickets-count">
                        🎟️ {account.tickets.length} {account.tickets.length === 1 ? 'Ticket' : 'Tickets'}
                      </div>
                      {account.tickets.length > 0 && (
                        <div className="ticket-tags">
                          {account.tickets.map((ticket) => (
                            <span key={ticket} className="ticket-tag">
                              {ticket}
                              <button
                                className="remove-ticket-btn"
                                onClick={() => handleRemoveTicket(account._id, ticket)}
                                title="Remove ticket"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <section className="section">
            <h2 className="section-title">Ticket Management</h2>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon" style={{ background: 'linear-gradient(135deg, #4ECDC4, #FFD93D)' }}>
                  🎟️
                </span>
                Add Ticket to Account
              </h3>

              <form onSubmit={handleAddTicket}>
                <div className="form-group">
                  <label className="form-label">Select Account *</label>
                  <div className="account-search-wrapper">
                    <div className="search-input-wrapper">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        className="account-search-input"
                        placeholder="Search by account number or name..."
                        value={accountSearchQuery}
                        onChange={(e) => setAccountSearchQuery(e.target.value)}
                      />
                      {accountSearchQuery && (
                        <button
                          type="button"
                          className="clear-search-btn"
                          onClick={() => setAccountSearchQuery('')}
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {accounts.length === 0 ? (
                      <div className="account-selector-empty">
                        <div className="empty-icon">🎭</div>
                        <p>No accounts available. Create one first!</p>
                      </div>
                    ) : (
                      <>
                        {accounts.filter(account => {
                          const query = accountSearchQuery.toLowerCase();
                          return account.accountNumber.toLowerCase().includes(query) ||
                                 (account.name && account.name.toLowerCase().includes(query));
                        }).length === 0 ? (
                          <div className="account-selector-empty">
                            <div className="empty-icon">🔎</div>
                            <p>No accounts match "{accountSearchQuery}"</p>
                            <button
                              type="button"
                              className="btn-link"
                              onClick={() => setAccountSearchQuery('')}
                            >
                              Clear search
                            </button>
                          </div>
                        ) : (
                          <div className="account-selector-grid">
                            {accounts
                              .filter(account => {
                                const query = accountSearchQuery.toLowerCase();
                                return account.accountNumber.toLowerCase().includes(query) ||
                                       (account.name && account.name.toLowerCase().includes(query));
                              })
                              .map((account) => (
                                <div
                                  key={account._id}
                                  className={`account-selector-card ${selectedAccountId === account._id ? 'selected' : ''}`}
                                  onClick={() => setSelectedAccountId(account._id)}
                                >
                                  <div className="account-selector-header">
                                    <div className="account-selector-number">{account.accountNumber}</div>
                                    {selectedAccountId === account._id && (
                                      <div className="selected-badge">✓</div>
                                    )}
                                  </div>
                                  {account.name && (
                                    <div className="account-selector-name">{account.name}</div>
                                  )}
                                  <div className="account-selector-tickets">
                                    <span className="ticket-icon">🎟️</span>
                                    <span>{account.tickets.length} {account.tickets.length === 1 ? 'ticket' : 'tickets'}</span>
                                  </div>
                                </div>
                              ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ticket Number *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., TICKET001"
                    value={ticketNumber}
                    onChange={(e) => setTicketNumber(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    ➕ Add Ticket
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCheckDuplicate}
                  >
                    🔍 Check Duplicate
                  </button>
                </div>
              </form>
            </div>

            {/* Ticket List */}
            {accounts.length > 0 && accounts.some(acc => acc.tickets.length > 0) ? (
              <div className="card">
                <h3 className="card-title">
                  <span className="card-icon" style={{ background: 'linear-gradient(135deg, #A78BFA, #FF6B6B)' }}>
                    🎟️
                  </span>
                  All Tickets ({accounts.reduce((sum, acc) => sum + acc.tickets.length, 0)})
                </h3>

                <div className="ticket-list-container">
                  {accounts.filter(acc => acc.tickets.length > 0).map((account) => (
                    <div key={account._id} className="ticket-account-group">
                      <div className="ticket-account-header">
                        <div className="ticket-account-info">
                          <span className="ticket-account-number">{account.accountNumber}</span>
                          {account.name && <span className="ticket-account-name">({account.name})</span>}
                        </div>
                        <span className="ticket-count-badge">
                          {account.tickets.length} {account.tickets.length === 1 ? 'ticket' : 'tickets'}
                        </span>
                      </div>
                      <div className="ticket-items-grid">
                        {account.tickets.map((ticket) => (
                          <div key={ticket} className="ticket-item">
                            <span className="ticket-item-number">{ticket}</span>
                            <button
                              className="ticket-delete-btn"
                              onClick={() => handleRemoveTicket(account._id, ticket)}
                              title="Delete this ticket"
                            >
                              🗑️
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon">🎟️</div>
                  <p className="empty-state-text">No tickets created yet. Add your first ticket above!</p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <section className="section">
            <h2 className="section-title">Search & Lookup</h2>

            <div className="card">
              <h3 className="card-title">
                <span className="card-icon" style={{ background: 'linear-gradient(135deg, #A78BFA, #4ECDC4)' }}>
                  🔎
                </span>
                Find Accounts & Tickets
              </h3>

              <form onSubmit={handleSearch}>
                <div className="form-group">
                  <label className="form-label">Search Type</label>
                  <div className="search-type-toggle">
                    <button
                      type="button"
                      className={`toggle-btn ${searchType === 'ticket' ? 'active' : ''}`}
                      onClick={() => {
                        setSearchType('ticket');
                        setSearchResults(null);
                      }}
                    >
                      <span className="toggle-icon">🎟️</span>
                      <span>By Ticket</span>
                    </button>
                    <button
                      type="button"
                      className={`toggle-btn ${searchType === 'account' ? 'active' : ''}`}
                      onClick={() => {
                        setSearchType('account');
                        setSearchResults(null);
                      }}
                    >
                      <span className="toggle-icon">👤</span>
                      <span>By Account</span>
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <div className="search-input-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      className="account-search-input"
                      placeholder={searchType === 'ticket' ? 'Enter ticket number to search...' : 'Enter account number to search...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        className="clear-search-btn"
                        onClick={() => {
                          setSearchQuery('');
                          setSearchResults(null);
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <span>🔍</span>
                  <span>Search Now</span>
                </button>
              </form>
            </div>

            {/* Search Results */}
            {searchResults && (
              <div className="search-results-container">
                {searchType === 'ticket' && searchResults.account && (
                  <div className="search-result-card">
                    <div className="result-header">
                      <span className="result-badge ticket-badge">🎟️ Ticket Found</span>
                    </div>

                    <div className="result-content">
                      <div className="result-section">
                        <div className="result-label">Ticket Number</div>
                        <div className="result-value ticket-value">
                          {searchResults.ticketNumber}
                        </div>
                      </div>

                      <div className="result-divider"></div>

                      <div className="result-section">
                        <div className="result-label">Assigned to Account</div>
                        <div className="result-account-info">
                          <div className="result-account-number">
                            {searchResults.account.accountNumber}
                          </div>
                          {searchResults.account.name && (
                            <div className="result-account-name">
                              {searchResults.account.name}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {searchType === 'account' && searchResults.account && (
                  <>
                    <div className="search-result-card">
                      <div className="result-header">
                        <span className="result-badge account-badge">👤 Account Found</span>
                      </div>

                      <div className="result-content">
                        <div className="result-section">
                          <div className="result-label">Account Number</div>
                          <div className="result-value account-value">
                            {searchResults.account.accountNumber}
                          </div>
                        </div>

                        {searchResults.account.name && (
                          <>
                            <div className="result-divider"></div>
                            <div className="result-section">
                              <div className="result-label">Account Name</div>
                              <div className="result-account-name">
                                {searchResults.account.name}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="search-result-card tickets-result">
                      <div className="result-header">
                        <span className="result-badge tickets-badge">
                          🎟️ {searchResults.tickets.length} {searchResults.tickets.length === 1 ? 'Ticket' : 'Tickets'}
                        </span>
                      </div>

                      <div className="result-content">
                        {searchResults.tickets.length > 0 ? (
                          <div className="result-tickets-grid">
                            {searchResults.tickets.map((ticket) => (
                              <div key={ticket} className="result-ticket-item">
                                <span className="ticket-icon">🎟️</span>
                                <span className="ticket-number">{ticket}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="result-empty-tickets">
                            <div className="empty-icon">🎭</div>
                            <p>No tickets assigned to this account yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            Made with ❤️ by <span className="footer-name">lamnbt1</span>
          </p>
          <p className="footer-source">
            <a
              href="https://github.com/Ngxba/fpt-ghc-lucky-number-tms"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              View Source on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
