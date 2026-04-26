import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Menu, 
  X,
  Target,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import styles from './Sidebar.module.css';

export const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/orchestrator', label: 'Full AI Analysis', icon: <Sparkles size={20} /> },
    { path: '/market-sizing', label: 'Market Sizing', icon: <Target size={20} /> },
    { path: '/demand-forecast', label: 'Demand Forecast', icon: <TrendingUp size={20} /> },
    { path: '/viability-check', label: 'Financial Viability', icon: <Wallet size={20} /> },
    { path: '/churn-prediction', label: 'Churn Prediction', icon: <AlertTriangle size={20} /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <BarChart3 color="white" size={24} />
        </div>
        {!isCollapsed && <h1 className={styles.logoText}>KMB AI</h1>}
        <button className={styles.toggleBtn} onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `${styles.navItem} ${isActive || (item.path !== '/' && location.pathname.startsWith(item.path)) ? styles.active : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {!isCollapsed && (
        <div className={styles.footer}>
          <p className={styles.version}>v0.1.0 Alpha</p>
        </div>
      )}
    </aside>
  );
};
