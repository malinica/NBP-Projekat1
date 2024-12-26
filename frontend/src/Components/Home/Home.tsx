import { Link } from "react-router-dom";
import styles from "./Home.module.css";
import { useState, useEffect } from "react";
import { getLeaderboardForPlacedAuctions } from "../../Services/AuctionService";
//import { Button } from "react-bootstrap";
//import { useAuth } from "../../Context/useAuth";
interface Record {
  username: string;
  postedAuctions: string;
}
const Home = () => {
  const [topUsers, setTopUsers] = useState<Record[] | undefined>(undefined);
  const [showButton, setShowButton] = useState(false);
  //const { isLoggedIn, user } = useAuth();

  const loadLeaderboard = async () => {
    const data = await getLeaderboardForPlacedAuctions();
    if (data) {
      setTopUsers(data);
    }
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
    <div className="container mt-5">
      <h1>Pocetna</h1>
      {topUsers ? (
        <>
          <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Posted Auctions</th>
              </tr>
            </thead>
            <tbody>
              {topUsers.map((user, index) => (
                <tr key={index} className={index === 0 ? "table-primary" : ""}>
                  <td>{index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.postedAuctions}</td>
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
