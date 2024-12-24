import axios from "axios";
import { Item } from "../Interfaces/Item/Item";
import toast from "react-hot-toast";

const baseApiRoute = "http://localhost:5257/api/Item";

export const createItemAPI = async (createItemDto: FormData) => {
    try {
        const data = await axios.post<Item>(baseApiRoute + "/create", createItemDto, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}