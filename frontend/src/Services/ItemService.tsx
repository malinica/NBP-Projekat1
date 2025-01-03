import axios from "axios";
import { Item } from "../Interfaces/Item/Item";
import toast from "react-hot-toast";
import { PaginatedResponseDTO } from "../Interfaces/PaginatedResponseDTO";

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

export const getItemsForUserAPI = async (username: string, page?: number, pageSize?: number) => {
    try {
        const response = await axios.get<PaginatedResponseDTO<Item>>(baseApiRoute + `/GetItemsFromUser/${username}?page=${page ?? 1}&pageSize=${pageSize ?? 10}`);

        return response;
    }
    catch(error:any) {
        console.error(error.response.data);
    }
}