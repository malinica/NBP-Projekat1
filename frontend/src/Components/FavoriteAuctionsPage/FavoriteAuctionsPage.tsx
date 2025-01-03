import { useEffect, useState } from "react";
import { Auction } from "../../Interfaces/Auction/Auction";
import { getFavoriteAuctionsAPI } from "../../Services/AuctionService";
import AuctionCard from "../AuctionCard/AuctionCard";
import Pagination from "../Pagination/Pagination";

type Props = {};

const FavoriteAuctionsPage = (props: Props) => {

  const [auctions, setAuctions] = useState<Auction[] | undefined>(undefined);
  const [totalAuctionsCount, setTotalAuctionsCount] = useState<number>(20);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    loadFavoriteAuctions(1, 10);
  }, []);

  const loadFavoriteAuctions = async (page: number, pageSize: number) => {
    try {
      const response = await getFavoriteAuctionsAPI(page, pageSize);

      if (response && response.status === 200) {
        setAuctions(response.data.data);
        setTotalAuctionsCount(response.data.totalLength);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavoriteAuction = (auctionId: string) => {
    setAuctions((prevAuctions) => prevAuctions?.filter((auction) => auction.id !== auctionId));
  }

  const handlePaginateChange = async (page: number, pageSize: number) => {
    await loadFavoriteAuctions(page, pageSize);
  }

  return (
    <div className="d-flex flex-column align-items-center mx-auto">
      <div className={`container`}>
      <h1 className={`text-center text-steel-blue m-2`}>Omiljene aukcije</h1>
      {isLoading ? (
        <p className={`text-center text-muted`}>Ucitavanje omiljenih aukcija... </p>
      ) : auctions && auctions.length > 0 ? (
        <>
          <div className={`row`}>
            {auctions.map((auction) => (
              <div key={auction.id} className={`col-12`}>
                <AuctionCard auction={auction} onRemoveFavoriteAuction={handleRemoveFavoriteAuction}/>
              </div>
            ))}

          </div>

        </>
      ) : (
        <p className={`text-center text-coral m-2`}>Nemate omiljenih aukcija.</p>
      )}
      </div>
      <div className="mb-3">
        {totalAuctionsCount > 0 && <Pagination totalLength={totalAuctionsCount} onPaginateChange={handlePaginateChange}/>}
      </div>
    </div>);
};

export default FavoriteAuctionsPage;
