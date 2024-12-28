import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Offer } from '../../Interfaces/Offer/Offer'
import { getOffersAPI } from '../../Services/OfferService'
import AuctionBidForm from '../AuctionBidForm/AuctionBidForm'
import toast from 'react-hot-toast'
import { useAuth } from '../../Context/useAuth'

type Props = {}

const Auction = (props: Props) => {
  const {id} = useParams();

  const [offers, setOffers] = useState<Offer[]|undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const {user, token} = useAuth();


  const initializeSignalRConnection = async () => {
    const connection = new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_API_URL}/auctionHub`, {
                      withCredentials: false,
                      accessTokenFactory: () => (token || ""),
                    })
                    .build();

    connection.on("ReceiveMessage", message => {
      console.log("Primljena poruka:", message);
    });

    connection.on("ReceiveOffers", offers => {
      console.log('Receive', offers);
      setOffers(offers);
    });

    try {
      await connection.start();
      console.log('Uspesna konekcija na SignalR hub');
      setConnection(connection);
    } catch(ex) {
      console.error("Doslo je do greske pri konekciji sa SignalR hubom:", ex);
    }
  }

  const initializePage = async () => {
    console.log("Saljem sub");
    await connection?.send("SubscribeToAuction", {
      auctionId: id,
      userId: user?.id
    });
    console.log("")

    const response = await getOffersAPI(id!, 10);
    
    if(response && response.status == 200) {
        console.log(response);
        setOffers(response.data);
    }
    setIsLoading(false);
  }

  const submitBid = async (bid: number) => {
    if (!connection) {
      toast.error("Konekcija sa serverom nije uspostavljena.");
      return;
    }

    try {
      console.log(user?.id);
      await connection.send("CreateOffer", {
        price: bid,
        auctionId: id,
        userId: user?.id
      });
      console.log("Ponuda je uspešno poslata.");
    } catch (error) {
      console.error("Došlo je do greške pri slanju ponude:", error);
    }
  }
  
  useEffect(() => {
    initializeSignalRConnection();
    initializePage();
  }, [])

  return (
    <div className="container">
        <div>Aukcija sa ID {id} (ovde treba prikazemo vrv predmet ili nesto da se zna za sta se licitira)</div>

        <AuctionBidForm onSubmitBid={submitBid}></AuctionBidForm>

        <br />
        <div className={`table-responsive`}>
          <table className={`table table-striped rounded`}>
            <thead className={`table-primary`}>
              <tr>
                <th className={``}>Korisničko ime</th>
                <th className={``}>Iznos ponude</th>
                <th className={``}>Vreme ponude</th>
              </tr>
            </thead>
            <tbody>
              {offers?.map(offer => (
                <tr key={offer.id}>
                  <td className={`text-muted`}>{offer.user.userName}</td>
                  <td className={`text-muted`}>{offer.price}</td>
                  <td className={`text-muted`}>{offer.offeredAt.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>   
    </div>
  )
}

export default Auction