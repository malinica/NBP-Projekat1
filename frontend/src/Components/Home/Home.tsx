import { useState, useEffect } from "react";
import { getLeaderboardForPlacedAuctions  } from "../../Services/AuctionService";

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
    <div className={`container-fluid bg-pale-blue d-flex justify-content-center flex-grow-1`}>
      <div className={`col-xxl-7 col-xl-7 col-lg-6 col-md-10 col-sm-12 p-5 m-4 bg-light rounded d-flex flex-column`}>
        <h1 className={`text-center text-steel-blue mb-3`}>Najaktivniji Korisnici</h1>
        {(topUsers && topUsers.length >0) && (
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
        ) }
      </div>
    </div>
  );
};

export default Home;
