import styles from "./StranicaAukcija.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from 'react';
import { useAuth } from "../../Context/useAuth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AuctionStatus } from "../../Enums/AuctionStatus";
import { getAuctions  } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";


const AuctionPage = () => {
  const [auctions, setAuctions] = useState<Array<Auction> | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [auctionsPerPage, setAuctionsPerPage] = useState<number>(10);


 const loadAuctions = async () => {
    const data = await getAuctions(auctionsPerPage*(pageNumber-1),auctionsPerPage);
    setAuctions(data);  
  };

  useEffect(() => {
    loadAuctions();  
}, [pageNumber,auctionsPerPage]); 

  return (<></>);
}
export default AuctionPage;