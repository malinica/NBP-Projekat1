import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Auction } from "../../Interfaces/Auction/Auction";
import { getFavoriteAuctionsAPI, removeFavoriteAuctionAPI } from "../../Services/AuctionService";
import AuctionCard from "../AuctionCard/AuctionCard";
import toast from "react-hot-toast";

type Props = {};

const FavoriteAuctionsPage = (props: Props) => {
  const { user } = useAuth();

  const [auctions, setAuctions] = useState<Auction[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadFavoriteAuctions();
  }, []);

  const loadFavoriteAuctions = async () => {
    try {
      const response = await getFavoriteAuctionsAPI();

      if (response && response.status === 200) {
        setAuctions(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavoriteAuction = async (auctionId: string) => {
    try {
        setIsLoading(true);
        const response = await removeFavoriteAuctionAPI(auctionId);
  
        if (response && response.status === 200) {
          toast.success(response.data);
          setAuctions((prevAuctions) => prevAuctions?.filter((auction) => auction.id !== auctionId));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
  }

  return <div className="container">
    <h1 className="text-center">Omiljene aukcije</h1>
    {isLoading ? (
      <p className="text-center text-muted">Ucitavanje omiljenih aukcija...</p>
    ) : auctions && auctions.length > 0 ? (
      <div className="row">
        {auctions.map((auction) => (
          <div key={auction.id} className="col-12">
            <AuctionCard auction={auction}/>
            <button className='btn btn-danger' onClick={() => handleRemoveFavoriteAuction(auction.id)}>Ukloni iz omiljenih</button>
          </div>
        ))}

      </div>
    ) : (
      <p className="text-center text-muted">Nemate omiljenih aukcija.</p>
    )}
  </div>;
};

export default FavoriteAuctionsPage;
