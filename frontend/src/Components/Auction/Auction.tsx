import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { HubConnectionBuilder } from '@microsoft/signalr'
import { Offer } from '../../Interfaces/Offer/Offer'
import { getOffersAPI } from '../../Services/OfferService'

type Props = {}

const Auction = (props: Props) => {
  const {id} = useParams();

  const [offers, setOffers] = useState<Offer[]|undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initializeSignalRConnection = () => {
    const connection = new HubConnectionBuilder()
                    .withUrl(`${import.meta.env.VITE_API_URL}/auctionHub`, {withCredentials: false})
                    .build();

    connection.start()
                .then(() => console.log('Uspesna konekcija na SignalR hub'))
                .catch(err => console.error('Doslo je do greske pri konekciji sa SignalR hubom', err));

    connection.on("ReceiveMessage", message => {
        console.log("Primljena poruka:", message);
    });
  }

  const loadOffers = async () => {
    const response = await getOffersAPI(id!, 10);
    
    if(response && response.status == 200) {
        console.log(response);
        setOffers(response.data);
    }
    setIsLoading(false);
  }
  
  useEffect(() => {
    initializeSignalRConnection();
    loadOffers();
  }, [])

  return (
    <div className="container">
        <div>Aukcija sa ID {id} (ovde treba prikazemo vrv predmet ili nesto nzm)</div>

    </div>
  )
}

export default Auction