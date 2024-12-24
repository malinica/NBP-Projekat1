import { AuctionStatus } from "../../Enums/AuctionStatus";

//AuctionStatus
export interface Auction {
    id: number;
    Title: string;
    StartingPrice: Number;
    CurrentPrice: Number;
    Status: AuctionStatus;
    PostedOnDate: Date;
    DueTo:Date;
}