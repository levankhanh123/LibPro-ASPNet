import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LibrarianLayout = () => {
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
                    <h3>LibPro <span>Librarian</span></h3>
                </div>
                <nav className="sidebar-nav">
                    <ul className="librarian-sidebar-menu">
                        <li>
                            <NavLink to="/librarian/categories">
                                <span className="menu-icon">CA</span>
                                <span className="menu-text">Categories</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/books">
                                <span className="menu-icon">BK</span>
                                <span className="menu-text">Books</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/readers">
                                <span className="menu-icon">RD</span>
                                <span className="menu-text">Readers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/reservations">
                                <span className="menu-icon">RS</span>
                                <span className="menu-text">Reservations</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/loans">
                                <span className="menu-icon">LN</span>
                                <span className="menu-text">Loans</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/publishers">
                                <span className="menu-icon">PB</span>
                                <span className="menu-text">Publishers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/suppliers">
                                <span className="menu-icon">SP</span>
                                <span className="menu-text">Suppliers</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/librarian/profile">
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

export default LibrarianLayout;
