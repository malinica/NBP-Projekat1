import { User } from "../User/User";

export interface Offer {
    id: string;
    price: number;
    offeredAt: Date;
    user: User;
}