import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionsCreatedByUserAPI } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";
import AuctionCard from "../AuctionCard/AuctionCard";
import Pagination from "../Pagination/Pagination";

type Props = {};

const UserProfilePage = (props: Props) => {
  const { username } = useParams();

  const [auctions, setAuctions] = useState<Auction[] | undefined>(undefined);
  const [totalAuctionsCount, setTotalAuctionsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAuctions(1, 10);
  }, []);

  const loadAuctions = async (page: number, pageSize: number) => {
    try {
      const response = await getAuctionsCreatedByUserAPI(username!, page, pageSize);
      
      if (response && response.status == 200) {
        setAuctions(response.data.data);
        setTotalAuctionsCount(response.data.totalLength);
      }
    }
    catch(error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  };

  const handlePaginateChange = async (page: number, pageSize: number) => {
    await loadAuctions(page, pageSize);
  }

  return (
    <div className={`container`}>
    <h1 className={`text-center text-steel-blue m-2`}>Aukcije koje je korisnik <strong>{username}</strong> kreirao</h1>
    {isLoading ? (
      <p className={`text-center text-muted`}>Ucitavanje aukcija...</p>
    ) :
    <> 
      {auctions && auctions.length > 0 ? (
        <div className={`row`}>
          {auctions.map((auction) => (
            <div key={auction.id} className={`col-12`}>
              <AuctionCard auction={auction}/>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-center text-coral m-4`}>Korisnik nema kreiranih aukcija.</p>
      )}
      {totalAuctionsCount > 0 && <Pagination totalLength={totalAuctionsCount} onPaginateChange={handlePaginateChange}/>}
      </>}
    </div>
  );
};

export default UserProfilePage;
