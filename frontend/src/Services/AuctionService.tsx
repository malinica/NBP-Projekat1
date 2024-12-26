import axios from "axios";
import { Auction } from "../Interfaces/Auction/Auction";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Auction";

export const getLeaderboardForPlacedAuctions = async (): Promise<Array<{ username: string; auctions: number }> | undefined> => {
    try {
        const response = await axios.get<Record<string, number>>(baseApiRoute + "/auction/LeaderboardMostPlacedAuctions");
        const data = response.data;

        // Transformacija objekta u niz objekata sa 'username' i 'auctions'
        const transformedData = Object.entries(data).map(([username, auctions]) => ({
            username,
            auctions
        }));

        return transformedData;
    }
    catch (error) {
        console.error(error);
        return undefined;
    }
};

