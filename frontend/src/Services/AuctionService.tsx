import axios from "axios";
import { Auction } from "../Interfaces/Auction/Auction";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Auction";
interface LeaderboardData {
    [key: string]: string; 
    
  }
  
  interface Record {
    username: string;
    postedAuctions: string;
  }
  
  export const getLeaderboardForPlacedAuctions = async (): Promise<Record[] | undefined> => {
      try {
          const response = await axios.get<LeaderboardData>(baseApiRoute + "/auction/LeaderboardMostPlacedAuctions");
          const data = response.data;
  
          const leaderboard: Record[] = Object.keys(data).map(key => ({
              username: key,
              postedAuctions: data[key],
          }));
  
          return leaderboard;
      }
      catch (error) {
          console.error(error);
          return undefined; 
      }
  };