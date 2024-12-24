import axios from "axios";
import toast from "react-hot-toast";
import { AuthResponse } from "../Interfaces/User/AuthResponse";

const api = "http://localhost:5257/api/User";

export const loginAPI = async (email:string, password:string) => {
    try {
        const data = await axios.post<AuthResponse>(api+"/login", {
            email:email,
            password:password
        });

        return data;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}

export const registerAPI = async (email:string, username:string, password:string) => {
    try {
        const data = await axios.post<AuthResponse>(api+"/register", {
            email:email,
            username:username,
            password:password
        });

        return data;
    }
    catch(error:any) {
        toast.error(error.response.data);
    }
}

export const proveriUsernameAPI = async (username:string) => {
    try {
        const data = await axios.get<boolean>(api+`/ProveriUsername/${username}`);

        return data;
    }
    catch(error) {
        console.log(error);
    }
}

export const proveriEmailAPI = async (email:string) => {
    try {
        const data = await axios.get<boolean>(api+`/ProveriEmail/${email}`);

        return data;
    }
    catch(error) {
        console.log(error);
    }
}