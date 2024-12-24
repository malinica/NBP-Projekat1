import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import lutalica from "../../Assets/lutalica.png";
import nestao from "../../Assets/nestao.png";
import forum from "../../Assets/forum.png";
import uazilu from "../../Assets/uazilu.png";
import pocetna from "../../Assets/pocetna.png";
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
    <div className={`container-fluid p-0`}>
      <div className={`container-fluid ${styles.pocetna}`} id="pocetak">
        <div className={`row container mx-auto ${styles.pocetna}`}>
          <div className={`col-sm-12 col-md-5 col-lg-6 col-xl-6 col-xxl-6 py-5 mt-5 text-center`}>
            <h1 className={`mt-5 mb-2 text-blue`}></h1>
            <h6 className={`mb-4 text-chocolate`}></h6>
            <Link
              to="/StranicaPretrage"
              className={`text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
            >
              UDOMI ME
            </Link>
          </div>
          <div className={`col-sm-12 col-md-7 col-lg-6 col-xl-6 col-xxl-6 mt-5 max-width `}>
            <img src={pocetna} alt="pocetna slika" className={`img-fluid`} />
          </div>
        </div>
      </div>

      <div className={`container-fluid bg-powder `} id="onama">
        <div className={`py-5 text-center`}>
          <h1 className={`py-5 text-blue`}></h1>
        </div>
        <div className={`container mx-auto bg-powder`}>
          <div className={`row d-flex justify-content-center`}>
            <div className={`row mb-4 mt-4`}>
              <div
                className={`col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 d-flex justify-content-center`}
              >
                <img
                  src={lutalica}
                  alt="pocetna slika 1"
                  className={`img-fluid`}
                />
              </div>
              <div
                className={`my-1 col-sm-10 col-md-5 col-lg-6 col-xl-7 col-xxl-8`}
              >
                <div className={`col-md-10`}>
                  <h3 className={`text-white`}>
                  </h3>
                  <br></br>
                  <Link
                    to="/StranicaPrijavePsa"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                  </Link>
                </div>
              </div>
            </div>

            <hr className={`text-chocolate`}></hr>

            <div className={`row mb-4 mt-4`}>
              <div
                className={`my-3 col-sm-10 col-md-5 col-lg-6 col-xl-7 col-xxl-8`}
              >
                <div className={`col-md-10`}>
                  <h3 className={`text-white`}>
                  </h3>
                  <br></br>
                  <Link
                    to="/StranicaPrijavePsa"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                  </Link>
                </div>
              </div>
              <div
                className={`col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 d-flex d-flex justify-content-center`}
              >
                <img
                  src={nestao}
                  alt="pocetna slika 1"
                  className={`img-fluid`}
                />
              </div>
            </div>

            <hr className={`text-chocolate`}></hr>

            <div className={`row mb-4 mt-4`}>
              <div
                className={`col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 d-flex justify-content-center`}
              >
                <img
                  src={uazilu}
                  alt="pocetna slika 1"
                  className={`img-fluid`}
                />
              </div>
              <div
                className={`my-1 col-sm-10 col-md-5 col-lg-6 col-xl-7 col-xxl-8`}
              >
                <div className={`col-md-10`}>
                  <h3 className={`text-white`}>
                  </h3>
                  <br></br>
                  <Link
                    to="/StranicaPretrage"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                  </Link>
                </div>
              </div>
            </div>

            <hr className={`text-chocolate`}></hr>

            <div className={`row mb-4 mt-4`}>
              <div
                className={`my-2 col-sm-10 col-md-5 col-lg-6 col-xl-7 col-xxl-8`}
              >
                <div className={`col-md-10`}>
                  <h3 className={`text-white`}>
                  </h3>
                  <br></br>
                  <Link
                    to="/StranicaForuma"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                  </Link>
                </div>
              </div>
              <div
                className={`my-2 col-sm-10 col-md-7 col-lg-6 col-xl-5 col-xxl-4 d-flex justify-content-center`}
              >
                <img
                  src={forum}
                  alt="pocetna slika 1"
                  className={`img-fluid`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <button onClick={scrollToTop} className={`bg-blue text-white ${styles.pocetak} ${showButton ? 'd-block' : 'd-none'}`} title="Idi na pocetak">^</button>
    </div>
  );
};

export default Home;
