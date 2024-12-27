import { faUser , faBars} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import styles from "./Navbar.module.css";
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
      <nav className={`navbar navbar-expand-xl bg-baby-blue`} id="mainNav">
        <div className={`container d-flex justify-content-between`}>
          <Link className={`navbar-brand`} to="/">
            <img className={`${styles.logo}`} src="src/assets/logo.png" alt="logo" />
          </Link>
          <button className={`navbar-toggler`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`collapse navbar-collapse pb-4 pb-xxl-0 d-xl-flex justify-content-xl-end`} id="navbarResponsive">
            <ul className={`navbar-nav`}>
              <li className={`my-2 text-end`}>{<Link to="/auctions" className={` ${getLinkClass("/add-item")} ${styles.link}`}>AUKCIJE</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/create-item" className={` ${getLinkClass("/add-item")} ${styles.link}`}>DODAJ PREDMET</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/" className={` ${getLinkClass("/add-item")} ${styles.link}`}>MOJI PREDMETI</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/" className={` ${getLinkClass("/add-item")} ${styles.link}`}>MOJE PONUDE</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/" className={` ${getLinkClass("/add-item")} ${styles.link}`}>OMILJENO</Link>} </li>

              {isLoggedIn() 
                 ?                
                 <li className={`ms-3 text-end`}>
                 <Dropdown>
                   <Dropdown.Toggle className={styles['user-dropdown']} variant="light" id="dropdown-basic">
                     <FontAwesomeIcon icon={faUser} /> {user!.userName.toUpperCase()}
                   </Dropdown.Toggle>

                   <Dropdown.Menu align={'end'}>
                    {user?.role!=Role.User &&
                     <Dropdown.Divider />}
                     <Dropdown.Item onClick={handleLogout} className={styles['custom-dropdown-item1']}>ODJAVI SE</Dropdown.Item>
                   </Dropdown.Menu>
                 </Dropdown>
                </li>         
                  :
                <>
                  <li className={`my-2 text-end`}><Link to="/login" className={`${getLinkClass("/login")} ${styles.link}`}>PRIJAVA</Link></li>
                  <li className={`my-2 text-end`}><Link to="/register" className={`${getLinkClass("/register")} ${styles.link}`}>REGISTRACIJA</Link></li>
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
