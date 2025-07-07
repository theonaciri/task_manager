import React from 'react';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <Link to="/projects">Gestionnaire de Tâches</Link>
          </h1>
          <nav className="nav">
            <Link to="/projects" className="nav-link">
              Projets
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Gestionnaire de Tâches. Développé avec Laravel & React.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
