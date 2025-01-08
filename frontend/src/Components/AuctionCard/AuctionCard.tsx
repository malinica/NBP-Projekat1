import { Auction } from '../../Interfaces/Auction/Auction'
import ItemCard from '../ItemCard/ItemCard'
import { Link } from 'react-router-dom'
import styles from "./AuctionCard.module.css";
import { addFavoriteAuctionAPI, canAddFavoriteAuctionAPI, removeFavoriteAuctionAPI, updateAuctionAPI } from '../../Services/AuctionService';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuth } from '../../Context/useAuth';
import DatePicker from 'react-datepicker';
import { UpdateAuctionDTO } from '../../Interfaces/Auction/UpdateAuctionDTO';

type Props = {
    auction: Auction,
    onRemoveFavoriteAuction?: (auctionId: string) => void
}

const AuctionCard = ({auction, onRemoveFavoriteAuction}: Props) => {
  const [canAddToFavorite, setCanAddToFavorite] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>("");
  const [updatedStartingPrice, setUpdatedStartingPrice] = useState<number>(0);
  const [updatedDueTo, setUpdatedDueTo] = useState<Date>(new Date());
  const {isLoggedIn, user} = useAuth();

  useEffect(() => {
    if(isLoggedIn())
      checkIfCanAddToFavorite();
      setUpdatedTitle(auction.title);
      setUpdatedStartingPrice(auction.startingPrice);
      setUpdatedDueTo(new Date(auction.dueTo));
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

  const handleUpdate = async () => {
    try {
      if (!updatedTitle || !updatedStartingPrice || !updatedDueTo) {
        toast.error("Molimo popunite sva obavezna polja!");
        return;
      }
      const newData: UpdateAuctionDTO = {
        title: updatedTitle,
        startingPrice: updatedStartingPrice,
        dueTo: updatedDueTo.toISOString()
      }
      const response = await updateAuctionAPI(auction.id, newData);
      if (response && response.status == 200) {
        toast.success("Predmet uspešno ažuriran!");
        setEditMode(false);
        auction.title = response.data.title;
        auction.startingPrice = response.data.startingPrice;
        auction.dueTo = response.data.dueTo;
      }
      else {
        toast.error("Neuspešno ažuriranje predmeta. Pokušajte ponovo.");
      }
    } catch (error) {
      toast.error("Neuspešno ažuriranje predmeta. Pokušajte ponovo.");
    }
  };

  return (
    <div className={`container my-2 p-2 rounded-2 border border-2`}>
      <div className={`row`}>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12`}>
          {editMode 
          ? 
          (<>
            <form>
                <div className={`mb-3`}>
                    <label htmlFor="title" className={`form-label text-steel-blue`}>Naslov</label>
                    <input
                        type="text"
                        className={`form-control`}
                        id="title"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="price" className={`form-label text-steel-blue`}>Početna cena</label>
                    <input
                        type="number"
                        className={`form-control`}
                        id="price"
                        value={updatedStartingPrice}
                        onChange={(e) => setUpdatedStartingPrice(Number(e.target.value))}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="dueDate" className={`form-label text-steel-blue me-2`}>Datum završetka aukcije</label>
                    <DatePicker
                        selected={updatedDueTo}
                        onChange={(date:any) => setUpdatedDueTo(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                        minDate={new Date(new Date().setDate(new Date().getDate() + 1))} 
                    />
                </div>
            </form>
            <button
                className={`btn btn-sm my-2 text-center text-white rounded py-2 px-2 ${styles.dugme3} ${styles.linija_ispod_dugmeta}`}
                onClick={handleUpdate}
            >
                Sačuvaj
            </button>
            <button
                className={`btn btn-sm mx-1 my-2 text-center text-white rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
                onClick={() => setEditMode(false)}
            >
                Otkaži
            </button>
          </>) 
          : 
          (<>
            <h5 className={`text-steel-blue`}>{auction.title}</h5>
            <p className={`text-steel-metal`}>Početna cena: {auction.startingPrice}</p>
            <p className={`text-steel-metal`}>Najviša ponuda: {auction.currentPrice}</p>
            <p className={`text-steel-metal`}>Kreirano: {new Date(auction.postedOnDate).toLocaleString("sr")}</p>
            <p className={`text-steel-metal`}>Traje do: {new Date(auction.dueTo).toLocaleString("sr")}</p>
            <Link to={`/auctions/${auction.id}`} className={`btn btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.dugme_ispod_linije}`}>Pogledaj ponude</Link>
            
            {!isLoading && (canAddToFavorite 
            ? 
            <button className={`btn btn-lg mx-2 text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.dugme_ispod_linije}`} onClick={handleAddToFavorites}>Dodaj u omiljene</button> 
            : 
            <button className={`btn btn-lg mx-2 text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.dugme_ispod_linije}`} onClick={handleRemoveFavoriteAuction}>Ukloni iz omiljenih</button>
            )}

            {user?.id == auction.item.author.id &&
            <button className={`btn btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme3} ${styles.dugme_ispod_linije}`} onClick={() => setEditMode(true)}>Izmeni</button>}
          </>)
          }
        </div>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-7 col-sm-12`}>
          <ItemCard item={auction.item} showAddToAuctionButton={false}/>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard;