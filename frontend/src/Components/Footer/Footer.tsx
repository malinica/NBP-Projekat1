import styles from "./Footer.module.css";
import React from 'react';
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

  return (
    <div
      className={`footer container-fluid py-2 text-center text-white bg-steel-blue`}
    >
      <div className={`container navbar navbar-expand-lg justify-content-center`}>
        <ul className={`navbar-nav mt-2 mb-1`}>
          <li className={`nav-item`}>
            <a href="#onama" className={`text-white mx-2 text-decoration-none`} onClick={scrollToTop}>
              O NAMA
            </a>
          </li>
          <li className={`nav-item`}>
            <Link to="/auctions" className={`text-white mx-2 text-decoration-none`} onClick={scrollToTop}>
              AUKCIJE
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link to="" className={`text-white mx-2 text-decoration-none`} onClick={scrollToTop}>
              USKORO
            </Link>
          </li>
          <li className={`nav-item`}>
            <Link to="" className={`text-white mx-2 text-decoration-none`} onClick={scrollToTop}>
              USKORO
            </Link>
          </li>
        </ul>
      </div>

      <hr className={`text-orange`} />
      <p className={`text-center pt-2`}>&copy;InfinityBid 2024</p>
    </div>
  );
};

export default Footer;
