import {Link, NavLink} from 'react-router-dom';

function Navbar() {

    const linkClass = ({isActive}) => {
        `nav-link ${isActive ? 'active fw-bold text-primary' : ''}`;
    }

    return(
        <nav className="navbar navbar-expand navbar-light bg-light border-bottom">
            <div className="container">
                {/* Brand link */}
                <Link className="navbar-brand" to="/">
                    Recipe List
                </Link>

                <ul className="navbar-nav ms-auto">
                    <li className="nav-item me-4">
                        <NavLink className={linkClass} to="/">
                            Home
                        </NavLink>
                    </li>

                    <li className="nav-item me-4">
                        <NavLink className={linkClass} to="/form">
                            Submission Form
                        </NavLink>
                    </li>

                    <li className="nav-item">
                        <NavLink className={linkClass} to="/about">
                            About
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
export default Navbar;