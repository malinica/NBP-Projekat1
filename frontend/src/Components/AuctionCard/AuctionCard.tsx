import { Auction } from '../../Interfaces/Auction/Auction'
import ItemCard from '../ItemCard/ItemCard'
import { Link } from 'react-router-dom'
import styles from "./AuctionCard.module.css";
import { addFavoriteAuctionAPI, canAddFavoriteAuctionAPI, removeFavoriteAuctionAPI } from '../../Services/AuctionService';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/useAuth';

type Props = {
    auction: Auction,
    onRemoveFavoriteAuction?: (auctionId: string) => void
}

const AuctionCard = ({auction, onRemoveFavoriteAuction}: Props) => {
  const [canAddToFavorite, setCanAddToFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {isLoggedIn} = useAuth();

  useEffect(() => {
    if(isLoggedIn())
      checkIfCanAddToFavorite();
  }, []);

  const checkIfCanAddToFavorite = async () => {
    try {
      const response = await canAddFavoriteAuctionAPI(auction.id);
      if (response && response.status === 200) {
        setCanAddToFavorite(response.data);
      }
    } catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleAddToFavorites = async () => {
    try {
      const response = await addFavoriteAuctionAPI(auction.id);
      if (response && response.status === 200) {
        toast.success(response.data);
        setCanAddToFavorite(false);
      } else {
        toast.error('Neuspešno dodavanje aukcije u omiljene.');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveFavoriteAuction = async () => {
    try {
        const response = await removeFavoriteAuctionAPI(auction.id);
  
        if (response && response.status === 200) {
          toast.success(response.data);
          setCanAddToFavorite(true);
          onRemoveFavoriteAuction?.(auction.id);
        }
      } catch (error) {
        console.error(error);
      }
  }

  return (
    <div className={`container my-2 p-2 rounded-2 border border-2`}>
      <div className={`row`}>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12`}>
          <h5 className={`text-steel-blue`}>{auction.title}</h5>
          <p className={`text-steel-metal`}>Početna cena: {auction.startingPrice}</p>
          <p className={`text-steel-metal`}>Najviša ponuda: {auction.currentPrice}</p>
          <p className={`text-steel-metal`}>Status: {auction.status}</p>
          <p className={`text-steel-metal`}>Kreirano: {new Date(auction.postedOnDate).toLocaleString("sr")}</p>
          <p className={`text-steel-metal`}>Traje do: {new Date(auction.dueTo).toLocaleString("sr")}</p>
          <Link to={`/auctions/${auction.id}`} className={`btn btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.dugme_ispod_linije}`}>Pogledaj ponude</Link>
          
          {!isLoading && (canAddToFavorite 
          ? 
          <button className='btn bg-success' onClick={handleAddToFavorites}>Dodaj u omiljene</button> 
          : 
          <button className={`btn btn-danger`} onClick={handleRemoveFavoriteAuction}>Ukloni iz omiljenih</button>
          )}

        </div>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-7 col-sm-12`}>
          <ItemCard item={auction.item}/>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard;