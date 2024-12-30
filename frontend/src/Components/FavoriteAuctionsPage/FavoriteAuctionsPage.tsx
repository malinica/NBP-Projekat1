import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth";
import { Auction } from "../../Interfaces/Auction/Auction";
import { getFavoriteAuctionsAPI } from "../../Services/AuctionService";

type Props = {};

const FavoriteAuctionsPage = (props: Props) => {
  const { user } = useAuth();

  const [auctions, setAuctions] = useState<Auction[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadFavoriteAuctions = async () => {
    const response = await getFavoriteAuctionsAPI();

    if (response && response.status == 200) {
      console.log(response.data);
      setAuctions(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadFavoriteAuctions();
  }, []);

  return <div className="container">FavoriteAuctionsPage</div>;
};

export default FavoriteAuctionsPage;
