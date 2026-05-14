import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
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
                    <h3>LibPro <span>Director</span></h3>
                </div>

                <nav className="sidebar-nav">
                    <ul className="librarian-sidebar-menu">
                        <li>
                            <NavLink to="/admin/dashboard">
                                <span className="menu-icon">RP</span>
                                <span className="menu-text">Report</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/librarians">
                                <span className="menu-icon">ST</span>
                                <span className="menu-text">Librarians</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/system-logs">
                                <span className="menu-icon">LG</span>
                                <span className="menu-text">Audit Log</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/admin/profile">
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

export default AdminLayout;
