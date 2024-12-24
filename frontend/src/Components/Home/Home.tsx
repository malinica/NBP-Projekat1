import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
//import { Button } from "react-bootstrap";
//import { useAuth } from "../../Context/useAuth";

const Home = () => {
  const [showButton, setShowButton] = useState(false);
  //const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = () => {
    if (window.scrollY > 20) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <p>Pocetna</p>
  );
};

export default Home;
