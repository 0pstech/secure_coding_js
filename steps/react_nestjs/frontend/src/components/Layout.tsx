import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Secure Coding JS</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="
            default-src 'self';
            script-src 'self' http://192.168.1.82:5173;
            style-src 'self' 'unsafe-inline' http:/192.168.1.82:5173;
            img-src 'self' data:;
            connect-src 'self' https://api.openai.com http://192.168.1.82:5173 http://localhost:3000 ws://192.168.1.82:5173;
            object-src 'none';
            base-uri 'self';
          "
        />
      </Helmet>
      <div>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="container">
            <Link className="navbar-brand" to="/">Secure Coding JS</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/encrypt">Encrypt</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/ai">AI Assistant</Link>
                </li>
                {isAuthenticated ? (
                  <>
                    <li className="nav-item">
                      <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <main className="container py-4">
          <Outlet />
        </main>
      </div>
    </>
    
  );
} 