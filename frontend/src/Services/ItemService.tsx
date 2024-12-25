import axios from "axios";
import { Item } from "../Interfaces/Item/Item";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Item";

export const createItemAPI = async (createItemDto: FormData) => {
    try {
        const response = await axios.post<Item>(baseApiRoute + "/create", createItemDto, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}

export const getItemAPI = async (itemId: number) => {
    try {
        const response = await axios.get<Item>(baseApiRoute + `/${itemId}`);

        return response;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}