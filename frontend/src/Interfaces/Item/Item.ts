import { ItemCategory } from "../../Enums/ItemCategory";

export interface Item {
    id: number;
    name: string;
    description: string;
    category: ItemCategory;
    pictures: string[]
}