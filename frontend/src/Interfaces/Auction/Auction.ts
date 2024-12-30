import { AuctionStatus } from "../../Enums/AuctionStatus";
import { Item } from "../Item/Item";

//AuctionStatus
export interface Auction {
    id: string;
    title: string;
    startingPrice: number;
    currentPrice: number;
    status: AuctionStatus;
    postedOnDate: Date;
    dueTo:Date;
    item: Item;
}