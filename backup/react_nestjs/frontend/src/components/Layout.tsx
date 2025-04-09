import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">게시판</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/posts/create">글쓰기</Link>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={handleLogout}>로그아웃</button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">로그인</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">회원가입</Link>
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
  );
} 