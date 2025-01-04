import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Offer } from '../../Interfaces/Offer/Offer'
import { getOffersAPI } from '../../Services/OfferService'
import AuctionBidForm from '../AuctionBidForm/AuctionBidForm'
import toast from 'react-hot-toast'
import { useAuth } from '../../Context/useAuth'
import { canBidToAuctionAPI, getAuctionWithItemAPI, subscribeToAuctionAPI } from '../../Services/AuctionService'
import AuctionCard from '../AuctionCard/AuctionCard'
import { Auction } from '../../Interfaces/Auction/Auction'
import styles from "./AuctionPage.module.css";
import { AuctionStatus } from '../../Enums/AuctionStatus'

type Props = {}

const AuctionPage = (props: Props) => {
  const {id} = useParams();

  const [offers, setOffers] = useState<Offer[]|undefined>(undefined);
  const [auction, setAuction] = useState<Auction|null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [showAuctionCard, setShowAuctionCard] = useState<boolean>(true);
  const [canBid, setCanBid] = useState<boolean>(false);

  const {user, token} = useAuth();

  useEffect(() => {
    onComponentMount();

    return () => {
      onComponentUnmount();
    };
  }, [])

  const onComponentMount = async () => {
    await initializePage();
  }

  const initializePage = async () => {
    if(connection) 
    {
      console.log("Konekcija je vec uspostavljena.");
      return;
    }

    const newConnection = new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_API_URL}/auctionHub`, {
                      withCredentials: false,
                      accessTokenFactory: () => (token || ""),
                    })
                    .build();


    newConnection.on("ReceiveOffers", offers => {
      setOffers(offers);
    });

    newConnection.on("UpdateAuctionCurrentPrice", price => {
      setAuction((prevAuction) => {
        if (prevAuction) {
          return { ...prevAuction, currentPrice: price };
        }
        return prevAuction;
      });
    });

    newConnection.on("ReceiveMessage", (message, isSuccess) => {
      if(isSuccess) {
        toast.success(message);
      }
      else {
        toast.error(message);
      }
    });

    try {
      await newConnection.start();
      await subscribeToAuctionAPI(id!);
      await newConnection?.invoke("JoinAuctionGroup", id);

      const auctionResponse = await getAuctionWithItemAPI(id!);
      if(auctionResponse && auctionResponse.status == 200) {
        setAuction(auctionResponse.data);
      }

      const canBidResponse = await canBidToAuctionAPI(id!);
      if(canBidResponse && canBidResponse.status == 200) {
        setCanBid(canBidResponse.data);
      }

      const offersResponse = await getOffersAPI(id!, 10);
      if(offersResponse && offersResponse.status == 200) {
        setOffers(offersResponse.data);
      }
      
      setConnection(newConnection);
    } catch(ex) {
      console.error("Doslo je do greske pri inicijalizaciji stranice:", ex);
    }
    finally {
      setIsLoading(false);
    }
  }

  const onComponentUnmount = async () => {
    await connection?.invoke("LeaveAuctionGroup", id);
  }

  const submitBid = async (bid: number) => {
    if (!connection) {
      toast.error("Konekcija sa serverom nije uspostavljena.");
      return;
    }

    try {
      await connection.invoke<string>("CreateOffer", {
        price: bid,
        auctionId: id,
        userId: user?.id
      });
    } catch (error) {
      console.error("Došlo je do greške pri slanju ponude:", error);
    }
  }

  return (
    <div className={`container`}>
      {isLoading ? (
        <p className={`text-center text-coral`}>Učitavanje aukcije...</p>
      ) : (
        <>
          <div className={`my-4`}>
            {showAuctionCard && auction && <AuctionCard auction={auction} />} {}
          </div>
          <button
            className={`btn btn-lg text-white text-center rounded p-2 mb-2 ${styles.dugme1} ${styles.dugme_ispod_linije}`}
            onClick={() => setShowAuctionCard(!showAuctionCard)}
          >
            {showAuctionCard ? "Sakrij Aukciju" : "Prikaži Aukciju"}
          </button>

          {auction?.status == AuctionStatus.Closed ? (
            <h4 className={`text-center text-coral mt-3`}>
              Aukcija je završena.
            </h4>
          ) : (
            canBid && <AuctionBidForm onSubmitBid={submitBid}></AuctionBidForm>
          )}

          <br />
          {offers && offers.length > 0 ? (
            <div className={`table-responsive mt-2`}>
              <table className={`table table-striped rounded`}>
                <thead className={`table-primary`}>
                  <tr>
                    <th className={``}>Rang</th>
                    <th className={``}>Korisničko ime</th>
                    <th className={``}>Iznos ponude</th>
                    <th className={``}>Vreme ponude</th>
                  </tr>
                </thead>
                <tbody>
                  {offers?.map((offer, i) => (
                    <tr key={offer.id}>
                      <td className={`text-muted`}>{i + 1}.</td>
                      <td className={`text-muted`}>{offer.user.userName}</td>
                      <td className={`text-muted`}>{offer.price}</td>
                      <td className={`text-muted`}>
                        {" "}
                        {new Date(offer.offeredAt).toLocaleString("sr")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={`text-center text-coral mt-3`}>
              Nema ponuda za ovu aukciju.
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default AuctionPage