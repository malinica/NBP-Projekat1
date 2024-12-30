import axios from "axios";
import { Auction } from "../Interfaces/Auction/Auction";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Auction";

export const getLeaderboardForPlacedAuctions = async (): Promise<Array<{ username: string; auctions: number }> | undefined> => {
    try {
        const response = await axios.get<Record<string, number>>(baseApiRoute + "/LeaderboardMostPlacedAuctions");
        const data = response.data;

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

export const getAuctions = async (fromPosition: number, N: number): Promise<Array<Auction> | null> => {

    try {
        const response = await axios.get<Auction[]>(`${baseApiRoute}/LeaderboardAuctionsBasedOnTimeExpiring/${fromPosition}/${N}`);
        return response.data;
    }
    catch (error) {
        console.log(error)
        return null;
    }
};

export const GetAuctionCounter = async (): Promise<number | null> => {

    try {
        const response = await axios.get<number>(`${baseApiRoute}/GetAuctionCounter`);
        return response.data;
    }
    catch (error) {
        console.log(error)
        return null;
    }
};

export const subscribeToAuctionAPI = async (auctionId: string): Promise<string | null> => {

    try {
        const response = await axios.post<string>(`${baseApiRoute}/SubscribeToAuction/${auctionId}`);
        return response.data;
    }
    catch (error) {
        toast.error("Došlo je do greške pri pretplati na aukciju.");
        console.error(error)
        return null;
    }
};

export const getFavoriteAuctionsAPI = async () => {
    try {
        const response = await axios.get<Auction[]>(`${baseApiRoute}/GetFavoriteAuctions`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}