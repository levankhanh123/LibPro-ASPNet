import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ReaderLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="librarian-container">
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <h3>LibPro <span>Reader</span></h3>
                </div>
                <nav className="sidebar-nav">
                    <ul className="librarian-sidebar-menu">
                        <li>
                            <NavLink to="/reader/books">
                                <span className="menu-icon">BK</span>
                                <span className="menu-text">Books</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reader/my-loans">
                                <span className="menu-icon">LN</span>
                                <span className="menu-text">Borrowed Book History</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reader/reservations">
                                <span className="menu-icon">RS</span>
                                <span className="menu-text">My Reservations</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/reader/profile">
                                <span className="menu-icon">ME</span>
                                <span className="menu-text">My Profile</span>
                            </NavLink>
                        </li>
                        <li className="logout-item">
                            <button type="button" onClick={handleLogout}>
                                <span className="menu-icon">EX</span>
                                <span className="menu-text">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default ReaderLayout;
