import styles from "./MyOffersPage.module.css";
import { useEffect, useState } from 'react';
import { getAuctionsBiddedByUserAPI } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";
import AuctionCard from "../AuctionCard/AuctionCard";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/useAuth";

type Props = {};

const MyOffersPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [auctionsPerPageArray, setAuctionsPerPageArray] = useState<number[]>([5, 10, 15,]);
    const [auctions, setAuctions] = useState<Array<Auction> | null>(null);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(id ? parseInt(id, 10) : 1);
    const [auctionsPerPage, setAuctionsPerPage] = useState<number>(10);
    
    const changePageNumber = (
        e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
      ) => {
        const valueString = e.currentTarget.getAttribute("data-value");
        const valueNumber = valueString !== null ? parseInt(valueString, 10) : 1;
        setCurrentPageNumber(valueNumber);
       // window.history.pushState({}, '', `http://localhost:5173/myoffers-page/${valueNumber}`);
  
      };

      const changePageNumberPerPage = (
        e: React.MouseEvent<HTMLAnchorElement>
      ) => {
        const selectedValue = e.currentTarget.getAttribute("data-value");
        if (selectedValue !== null && Number(selectedValue) !== auctionsPerPage) {
          setAuctionsPerPage(Number(selectedValue));
        }
      };

      const loadAuctions = async () => {
        if (!user) {
            setAuctions(null);
            return;
        }
        
        try {
            const response = await getAuctionsBiddedByUserAPI(user.id);
            setAuctions(response?.data ?? null);
        } catch (error) {
            setAuctions(null);
        }
        
    }
      useEffect(() => {
        loadAuctions();
      }, []);
    
    return (<>
    <div className={`container`}>
      <h1 className={`text-center text-steel-blue m-2`}>Aukcije sa mojim ponudama</h1>
      <div className={`auctions-list`}>
          {auctions && auctions.length > 0 ? (
            auctions
            .slice((currentPageNumber - 1) * auctionsPerPage, currentPageNumber * auctionsPerPage)
            .map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
          ))
      ) : (
            <p className={`text-center text-coral m-2`}>Nema aukcija.</p>
          )}
        </div>
          
        <div className={`d-flex justify-content-end`}>
            <div className={`my-2 dropdown`}>
              <button
                className={`${styles.ivica} rounded px-2 py-2 dropdown-toggle bg-orange text-white text-decoration-none border-none`}
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Broj objava po stranici: {auctionsPerPage}
              </button>
              <ul className={`dropdown-menu`} aria-labelledby="dropdownMenuButton1">
                {auctionsPerPageArray.map((value) => (
                  <li key={value}>
                    <a
                      className={`dropdown-item`}
                      data-value={value}
                      onClick={(e) => changePageNumberPerPage(e)}
                    >
                      {value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        <nav className={`mt-2 me-2 d-flex justify-content-end`}>
              <ul className={`pagination`}>
                {currentPageNumber != 1 && (
                  <>
                    <li className={`page-item`}>
                      <a
                        className={`btn btn-sm text-white text-center rounded py-1 px-1 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                        data-value={currentPageNumber - 1}
                        onClick={(e) => {
                          changePageNumber(e);
                        }}
                      >
                        Prethodna
                      </a>
                    </li>
                  </>
                )}
                          
                {(
                  (auctions && ((auctions.length-currentPageNumber*auctionsPerPage)>0) )) && (
                  <>
                    <li className={`page-item`}>
                      <a
                        className={`btn btn-sm text-white text-center rounded py-1 px-1 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                        data-value={currentPageNumber + 1}
                        onClick={(e) => {
                          changePageNumber(e);
                        }}
                      >
                        Sledeća
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
    
        </>);
}
export default MyOffersPage;