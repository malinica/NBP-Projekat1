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
    <div>
      <h1>Pocetna</h1>
      {topUsers && topUsers.length > 0 ? (
        <>
          <p>Pocetnaaa</p>
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Posted Auctions</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user) => (
                <tr key={user.username}>
                  <td>{user.username}</td>
                  <td>{user.auctions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading...</p>
            )}
    </div>
  );
};

export default Home;
