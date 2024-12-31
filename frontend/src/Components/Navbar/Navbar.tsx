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
  const getLinkClass3 = (path1: string, path2:string,path3:string) => {
    return (location.pathname === path1 || location.pathname===path2 || location.pathname===path3) ? 'link link-hover active' : 'link link-hover';
  };
  
  return (
    <>
      <nav className={`navbar navbar-expand-xl bg-baby-blue`} id="mainNav">
        <div className={`container text-center`}>
          <Link className={`navbar-brand`} to="/">
            <img className={`${styles.logo}`} src="src/assets/logo.png" alt="logo" />
          </Link>
          <button className={`navbar-toggler`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`collapse navbar-collapse justify-content-xl-end`} id="navbarResponsive">
            <ul className={`navbar-nav justify-content-center flex-wrap`}>
              {location.pathname === '/' && (
                <li className="my-2 text-end">
                  <a href="#onama" className={`${styles.link} ${styles['link-hover']}`}>O NAMA</a>
                </li>)}
              <li className={`my-2 text-end`}>{<Link to="/search-page/1" className={` ${getLinkClass("/add-item")} ${styles.link} ${styles['link-hover']}`}>AUKCIJE</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/create-item" className={` ${getLinkClass("/add-item")} ${styles.link} ${styles['link-hover']}`}>DODAJ PREDMET</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/my-items" className={` ${getLinkClass("/add-item")} ${styles.link} ${styles['link-hover']}`}>MOJI PREDMETI</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/" className={` ${getLinkClass("/add-item")} ${styles.link} ${styles['link-hover']}`}>MOJE PONUDE</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/favorite-auctions" className={` ${getLinkClass("/add-item")} ${styles.link} ${styles['link-hover']}`}>OMILJENO</Link>} </li>

              {isLoggedIn() 
                 ?                
                 <li className={`ms-3 text-end`}>
                 <Dropdown>
                   <Dropdown.Toggle className={styles['user-dropdown']} variant="light" id="dropdown-basic">
                     <FontAwesomeIcon icon={faUser} /> {user!.userName.toUpperCase()}
                   </Dropdown.Toggle>

                   <Dropdown.Menu align={'end'}>
                     <Dropdown.Item className={styles['custom-dropdown-item1']}>
                        <Link to={`/users/${user!.userName}`} className={styles['custom-dropdown-link']}>MOJ PROFIL</Link>
                     </Dropdown.Item>
                     <Dropdown.Divider />
                     <Dropdown.Item onClick={handleLogout} className={styles['custom-dropdown-item1']}>ODJAVI SE</Dropdown.Item>
                   </Dropdown.Menu>
                 </Dropdown>
                </li>         
                  :
                <>
                  <li className={`my-2 text-end`}><Link to="/login" className={`${getLinkClass("/login")} ${styles.link} ${styles['link-hover']}`}>PRIJAVA</Link></li>
                  <li className={`my-2 text-end`}><Link to="/register" className={`${getLinkClass("/register")} ${styles.link} ${styles['link-hover']}`}>REGISTRACIJA</Link></li>
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
