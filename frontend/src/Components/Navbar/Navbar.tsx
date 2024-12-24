import { faUser , faBars} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import "./Navbar.css"
import { Dropdown } from 'react-bootstrap';
import { Role } from "../../Enums/Role";

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();

  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getLinkClass = (path: string) => {
    return location.pathname === path ? 'link link-hover active' : 'link link-hover';
  };
  
  return (
    <>
      <nav className={`navbar navbar-expand-xl bg-cyan-blue`} id="mainNav">
        <div className={`container d-flex justify-content-between`}>
        <Link className={`navbar-brand`} to="/">
            <img className={`logo`} src="src/assets/logo.png" alt="logo" />
          </Link>
          <button className={`navbar-toggler`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`collapse navbar-collapse pb-4 pb-xxl-0 d-xl-flex justify-content-xl-end`} id="navbarResponsive">
            <ul className={`navbar-nav`}>
              {isLoggedIn() 
                  ?
                 <li className={`ms-3 text-end`}>
                 <Dropdown>
                   <Dropdown.Toggle className={`user-dropdown`} variant="light" id="dropdown-basic">
                     <FontAwesomeIcon icon={faUser} /> {user!.username.toUpperCase()}
                   </Dropdown.Toggle>

                   <Dropdown.Menu align={'end'}>
                    {user?.role!=Role.User &&
                     <Dropdown.Divider />}
                     <Dropdown.Item onClick={handleLogout} className={`custom-dropdown-item1`}>ODJAVI SE</Dropdown.Item>
                   </Dropdown.Menu>
                 </Dropdown>
                </li>         
                  :
                <>
                  <li className={`my-2 text-end`}><Link to="/StranicaPrijave" className={getLinkClass("/StranicaPrijave")}>PRIJAVA</Link></li>
                  <li className={`my-2 text-end`}><Link to="/StranicaRegistracije" className={getLinkClass("/StranicaRegistracije")}>REGISTRACIJA</Link></li>
                </>
              }
            </ul>
          </div>

        </div>
      </nav>

    </>
  );
};

export default Navbar;
