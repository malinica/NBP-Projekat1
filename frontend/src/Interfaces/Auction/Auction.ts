import { AuctionStatus } from "../../Enums/AuctionStatus";
import { Item } from "../Item/Item";

//AuctionStatus
export interface Auction {
    id: number;
    Title: string;
    StartingPrice: Number;
    CurrentPrice: Number;
    Status: AuctionStatus;
    PostedOnDate: Date;
    DueTo:Date;
    Item: Item;
}