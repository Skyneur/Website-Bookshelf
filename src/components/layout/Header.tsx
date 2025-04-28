import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { toggleDarkMode } from '../../store/slices/uiSlice';
import { FaUserCircle, FaBell, FaMoon, FaSun, FaSearch } from 'react-icons/fa';
import '../../assets/styles/components/layout/Header.scss';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { darkMode, notifications } = useSelector((state: RootState) => state.ui);
  
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [searchActive, setSearchActive] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };
  
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implémenter la logique de recherche
      console.log('Recherche:', searchQuery);
      setSearchActive(false);
    }
  };
  
  // Fermer les dropdown quand on clique à l'extérieur
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <header className="app-header">
      <div className="header-search">
        {searchActive ? (
          <form onSubmit={handleSearchSubmit} className="search-form active">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <button type="submit">
              <FaSearch />
            </button>
            <button type="button" onClick={() => setSearchActive(false)}>
              Annuler
            </button>
          </form>
        ) : (
          <button className="search-button" onClick={() => setSearchActive(true)}>
            <FaSearch />
            <span>Rechercher</span>
          </button>
        )}
      </div>
      
      <div className="header-actions">
        <button
          className="theme-toggle"
          onClick={handleDarkModeToggle}
          title={darkMode ? "Passer en mode clair" : "Passer en mode sombre"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        <div className="notifications-dropdown" ref={notificationRef}>
          <button 
            className={`notifications-button ${notifications.length > 0 ? 'has-notifications' : ''}`}
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notifications-badge">{notifications.length}</span>
            )}
          </button>
          
          {notificationsOpen && (
            <div className="dropdown-content">
              <h3>Notifications</h3>
              {notifications.length === 0 ? (
                <p className="no-notifications">Aucune notification</p>
              ) : (
                <ul className="notifications-list">
                  {notifications.map((notification) => (
                    <li key={notification.id} className={`notification ${notification.type}`}>
                      <p>{notification.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        <div className="user-dropdown" ref={dropdownRef}>
          <button className="user-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaUserCircle />
            <span>{user?.prenom} {user?.nom}</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-content">
              <div className="user-info">
                <FaUserCircle className="avatar-large" />
                <div>
                  <p className="user-name">{user?.prenom} {user?.nom}</p>
                  <p className="user-role">{user?.role === 'admin' ? 'Administrateur' : 'Bibliothécaire'}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
              </div>
              
              <ul className="dropdown-menu">
                <li><a href="#">Mon profil</a></li>
                <li><a href="#">Paramètres</a></li>
                <li><button onClick={handleLogout}>Déconnexion</button></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
