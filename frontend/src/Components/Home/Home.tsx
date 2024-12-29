import { useState, useEffect } from "react";
import { getLeaderboardForPlacedAuctions  } from "../../Services/AuctionService";
import pocetna from "../../Assets/pocetna.png";
import { Link } from "react-router-dom";
import styles from "./Home.module.css";

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

      <div className={`container my-5`}>
        <div className={`row text-center`}>
          <div className={`col-md-3`}>
            <i className={`bi bi-shield-check text-primary fs-1`}></i>
            <h5 className={`mt-3`}>Sigurnost</h5>
            <p className={`text-muted`}>Vaši podaci i transakcije su zaštićeni.</p>
          </div>
          <div className={`col-md-3`}>
            <i className={`bi bi-tags text-primary fs-1`}></i>
            <h5 className={`mt-3`}>Najbolje ponude</h5>
            <p className={`text-muted`}>Pronađite najbolje ponude na aukcijama.</p>
          </div>
          <div className={`col-md-3`}>
            <i className={`bi bi-people text-primary fs-1`}></i>
            <h5 className={`mt-3`}>Zajednica</h5>
            <p className={`text-muted`}>Pridružite se velikoj bazi korisnika.</p>
          </div>
          <div className={`col-md-3`}>
            <i className={`bi bi-currency-dollar text-primary fs-1`}></i>
            <h5 className={`mt-3`}>Jednostavno plaćanje</h5>
            <p className={`text-muted`}>Sigurna i brza plaćanja.</p>
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
                <td className={`text-muted`}>{user.username}</td>
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
