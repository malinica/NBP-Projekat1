import axios from "axios";
import { Offer } from "../Interfaces/Offer/Offer";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Offer";

export const getOffersAPI = async (auctionId: string, count: number) => {
    try {
        const response = await axios.get<Offer[]>(baseApiRoute + `/getOffersForAuction/${auctionId}/${count}`);

        return response;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}