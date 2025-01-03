import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuctionsCreatedByUserAPI } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";
import AuctionCard from "../AuctionCard/AuctionCard";

type Props = {};

const UserProfilePage = (props: Props) => {
  const { username } = useParams();

  const [auctions, setAuctions] = useState<Auction[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAuctions = async () => {
    const response = await getAuctionsCreatedByUserAPI(username!);

    if (response && response.status == 200) {
      setAuctions(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadAuctions();
  }, []);

  return (
    <div className={`container`}>
    <h1 className={`text-center text-steel-blue m-2`}>Aukcije koje je korisnik <strong>{username}</strong> kreirao</h1>
    {isLoading ? (
      <p className={`text-center text-muted`}>Ucitavanje aukcija...</p>
    ) : auctions && auctions.length > 0 ? (
      <div className={`row`}>
        {auctions.map((auction) => (
          <div key={auction.id} className={`col-12`}>
            <AuctionCard auction={auction}/>
          </div>
        ))}
      </div>
    ) : (
      <p className={`text-center text-coral m-2`}>Korisnik nema kreiranih aukcija.</p>
    )}
  </div>
  );
};

export default UserProfilePage;
