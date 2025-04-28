import React from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { FaBook, FaUsers, FaExchangeAlt, FaDollarSign, FaChartBar, FaCog, FaBars, FaTimes } from 'react-icons/fa';
import '../../assets/styles/components/layout/Sidebar.scss';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <>
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={handleToggleSidebar}></div>
      
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/logo.png" alt="La maison du Livre" />
            <h2>La maison du Livre</h2>
          </div>
          
          <button className="close-sidebar" onClick={handleToggleSidebar}>
            <FaTimes />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaChartBar />
                <span>Tableau de bord</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/documents" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaBook />
                <span>Documents</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/adherents" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaUsers />
                <span>Adhérents</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/emprunts" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaExchangeAlt />
                <span>Emprunts</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink to="/amendes" className={({ isActive }) => isActive ? 'active' : ''}>
                <FaDollarSign />
                <span>Amendes</span>
              </NavLink>
            </li>
            
            {user && user.role === 'admin' && (
              <li>
                <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                  <FaCog />
                  <span>Paramètres</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="sidebar-footer">
          <p>v1.0.0</p>
        </div>
      </aside>
      
      <button className={`toggle-sidebar ${sidebarOpen ? 'hidden' : ''}`} onClick={handleToggleSidebar}>
        <FaBars />
      </button>
    </>
  );
};

export default Sidebar;
