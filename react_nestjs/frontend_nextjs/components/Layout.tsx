import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  console.log('auth - ', isAuthenticated);
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" href="/">Secure Coding JS</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item me-2">
                    <Link href="/login" passHref legacyBehavior>
                      <button className="btn btn-outline-primary">Login</button>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/register" passHref legacyBehavior>
                      <button className="btn btn-primary">Register</button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
        </div>
      </nav>
      <main className="container py-4">
        {children}
      </main>
    </div>
  );
} 