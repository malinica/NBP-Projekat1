import { useState, useEffect } from "react";
import { getLeaderboardForPlacedAuctions  } from "../../Services/AuctionService";
import pocetna from "../../Assets/pocetna.png";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { faSearch , faPlusCircle, faUsers} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Home = () => {
  const [topUsers, setTopUsers] = useState<Array<{ username: string; auctions: number }> | undefined>(undefined);
  const [showButton, setShowButton] = useState(false);

  const loadLeaderboard = async () => {
    const data = await getLeaderboardForPlacedAuctions();
    setTopUsers(data);  
  };



  useEffect(() => {
    loadLeaderboard();
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
    <div className={`container-fluid p-0 bg-baby-blue`}>
      <div className={`w-100 text-center`}>
          <div className={`text-center mt-5`}>
            <h1 className={`text-steel-blue`}>Dobrodošli na našu platformu za aukcije!</h1>
            <p className={`lead text-coral`}>
              Kupujte, prodajte i licitirajte sa lakoćom. Pridružite se već danas!
            </p>
            <Link
                    to="/auctions"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
                  >
                    Pregledaj Aukcije
            </Link>
          </div>
          <img src={pocetna} alt="pocetna slika" className={`img-fluid`}/>
      </div>

      <hr className={`text-metal mx-5`}></hr>

      <div className={`container my-5 d-flex justify-content-center`}>
        <div className={`row justify-content-center text-center`}>
          <div className={`col-md-3`}>
            <FontAwesomeIcon icon={faSearch} className={`text-coral fs-1`} />            
            <h5 className={`mt-3 text-steel-blue`}>Pretražite aukcije</h5>
            <p className={`text-metal`}>Pronađite aukcije koje vas zanimaju brzo i jednostavno.</p>
            <Link
                    to="/CreateItem"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                    Pretraži Aukcije
            </Link>
          </div>
          <div className={`col-md-3`}>
            <FontAwesomeIcon icon={faPlusCircle} className={`text-coral fs-1`} />
            <h5 className={`mt-3 text-steel-blue`}>Dodajte predmet</h5>
            <p className={`text-metal`}>Postavite svoj predmet na aukciju u nekoliko koraka.</p>
            <Link
                    to="/CreateItem"
                    className={`btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                  >
                    Dodaj Predmet
            </Link>
          </div>
          <div className={`col-md-3`}>
            <FontAwesomeIcon icon={faUsers} className={`text-coral fs-1`} />
            <h5 className={`mt-3 text-steel-blue`}>Zajednica</h5>
            <p className={`text-metal`}>Pridružite se velikoj bazi korisnika.</p>
          </div>
        </div>
      </div>

    {(topUsers && topUsers.length > 0) && (
  <div className={`container-fluid bg-pale-blue d-flex justify-content-center flex-grow-1`}>
    <div className={`col-xxl-7 col-xl-7 col-lg-6 col-md-10 col-sm-12 p-5 m-4 bg-light rounded d-flex flex-column`}>
      <h1 className={`text-center text-steel-blue mb-3`}>Najaktivniji Korisnici</h1>
      <div className={`table-responsive`}>
        <table className={`table table-striped rounded`}>
          <thead className={`table-primary`}>
            <tr>
              <th className={``}>Korisničko ime</th>
              <th className={``}>Broj kreiranih aukcija</th>
            </tr>
          </thead>
          <tbody>
            {topUsers.map((user) => (
              <tr key={user.username}>
                <td className={`text-muted`}>
                  <Link to={`users/${user.username}`}>
                    {user.username}
                  </Link>
                </td>
                <td className={`text-muted`}>{user.auctions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}  


      <button onClick={scrollToTop} className={`bg-blue text-white ${styles.pocetak} ${showButton ? 'd-block' : 'd-none'}`} title="Idi na pocetak">^</button>
    </div>
  );
};

export default Home;
