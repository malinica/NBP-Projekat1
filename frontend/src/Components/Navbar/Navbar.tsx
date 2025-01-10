import { faUser , faBars} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";
import styles from "./Navbar.module.css";
import { Dropdown } from 'react-bootstrap';

const Navbar = () => {
  const { isLoggedIn, logout, user } = useAuth();

  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const getLinkClass = (path: string) => {
    return location.pathname === path
      ? `${styles.link} ${styles['link-hover']} ${styles.active}`
      : `${styles.link} ${styles['link-hover']}`;
  };  

  return (
    <>
      <nav className={`navbar navbar-expand-xl bg-baby-blue`} id="mainNav">
        <div className={`container text-center`}>
          <div className={`${styles.navbarBrandContainer}`}>
            <Link className={`navbar-brand`} to="/">
              <img className={`${styles.logo}`} src="src/assets/logo.png" alt="logo" />
            </Link>
            <Link className={`${styles.title}`} to="/">
              <span className={`${styles.proText}`}>Infinity</span>
              <span className={`${styles.connectText}`}>Bid</span>
            </Link>
          </div>
          <button className={`navbar-toggler`} type="button" data-bs-toggle="collapse" data-bs-target="#navbarResponsive">
            <FontAwesomeIcon icon={faBars} />
          </button>
          <div className={`collapse navbar-collapse justify-content-xl-end`} id="navbarResponsive">
            <ul className={`navbar-nav justify-content-center flex-wrap`}>
              <li className="my-2 text-end">
                  <a href="#onama" className={` ${getLinkClass("#onama")}`}>O NAMA</a>
              </li>
              <li className={`my-2 text-end`}>{<Link to="/search-page/1" className={` ${getLinkClass("/search-page/1")}`}>AUKCIJE</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/create-item" className={` ${getLinkClass("/create-item")}`}>DODAJ PREDMET</Link>} </li>
              <li className={`my-2 text-end`}>{isLoggedIn() && <Link to="/my-items" className={` ${getLinkClass("/my-items")}`}>MOJI PREDMETI</Link>} </li>

              {isLoggedIn() 
                 ?                
                 <li className={`ms-3 text-end`}>
                 <Dropdown>
                   <Dropdown.Toggle className={styles['user-dropdown']} variant="light" id="dropdown-basic">
                     <FontAwesomeIcon icon={faUser} /> {user!.userName.toUpperCase()}
                   </Dropdown.Toggle>

                   <Dropdown.Menu align={'end'}>
                     <Dropdown.Item className={styles['custom-dropdown-item1']} href={`/users/${user!.userName}`}>
                        <span className={styles['custom-dropdown-item2']}>MOJE AUKCIJE</span>
                     </Dropdown.Item>
                     <Dropdown.Item className={styles['custom-dropdown-item1']} href='/myoffers-page/1'>
                        <span className={styles['custom-dropdown-item2']}>MOJE PONUDE</span>
                     </Dropdown.Item>
                     <Dropdown.Item className={styles['custom-dropdown-item1']} href="/favorite-auctions">
                        <span className={styles['custom-dropdown-item2']}>OMILJENO</span>
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
