import { ItemCategory } from "../../Enums/ItemCategory";
import { User } from "../User/User";

export interface Item {
    id: number;
    name: string;
    description: string;
    category: ItemCategory;
    pictures: string[];
    author: User;
    auctionWinner: User | null;
}