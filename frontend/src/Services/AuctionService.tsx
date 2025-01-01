import axios from "axios";
import { Auction } from "../Interfaces/Auction/Auction";
import toast from "react-hot-toast";
import { ItemCategory } from "../Enums/ItemCategory";

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

export const addFavoriteAuctionAPI = async (auctionId: string) => {
    try {
        const response = await axios.post(`${baseApiRoute}/AddToFavorite/${auctionId}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const removeFavoriteAuctionAPI = async (auctionId: string) => {
    try {
        const response = await axios.delete(`${baseApiRoute}/RemoveFromFavorite/${auctionId}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getFavoriteAuctionsAPI = async () => {
    try {
        const response = await axios.get<Auction[]>(`${baseApiRoute}/GetFavoriteAuctions`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const getAuctionWithItemAPI = async (auctionId: string) => {
    try {
        const response = await axios.get<Auction|null>(`${baseApiRoute}/AuctionWithItem/${auctionId}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}
export const getAuctionsFromFilter = async (
    itemName: string | null,
    categories: ItemCategory[] | null,
    minPrice: number | null,
    maxPrice:number|null
) => {
    try {
        const params: any = {
            ...(itemName ? { itemName } : {}),
            ...(categories && categories.length ? { categories: categories.join(",") } : {}),
            ...(minPrice !== null && minPrice !== undefined ? { minPrice } : {}),
            ...(maxPrice !== null && maxPrice !== undefined ? { maxPrice } : {}),

        };
        const response = await axios.get<Auction[] | null>(
            `${baseApiRoute}/GetAuctionsFromFilter`,
            { params }
        );
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}


export const getAuctionsCreatedByUserAPI = async (username:string) => {
    try {
        const response = await axios.get<Auction[]>(`${baseApiRoute}/GetAuctionsCreatedBy/${username}`);
        return response;
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export const createAuctionAPI = async (username: string, auctionData: any) => {
    try{
        const response = await axios.post<{id: string}>(`${baseApiRoute}/set?username=${username}`, auctionData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data.id;
    }
    catch(error: any)
    {
        toast.error(error.response.data);
    }
}