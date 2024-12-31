import { Auction } from '../../Interfaces/Auction/Auction'
import ItemCard from '../ItemCard/ItemCard'
import { Link } from 'react-router-dom'
import styles from "./AuctionCard.module.css";

type Props = {
    auction: Auction, 
}

const AuctionCard = ({auction}: Props) => {
  return (
    <div className={`container my-2 p-2 rounded-2 border border-2`}>
      <div className={`row`}>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-6 col-sm-12`}>
          <h5 className={`text-steel-blue`}>{auction.title}</h5>
          <p className={`text-steel-metal`}>Starting price: {auction.startingPrice}</p>
          <p className={`text-steel-metal`}>Current price: {auction.currentPrice}</p>
          <p className={`text-steel-metal`}>Status: {auction.status}</p>
          <p className={`text-steel-metal`}>Posted on: {new Date(auction.postedOnDate).toLocaleString("sr")}</p>
          <p className={`text-steel-metal`}>Due to: {new Date(auction.dueTo).toLocaleString("sr")}</p>
          <Link to={`/auctions/${auction.id}`} className={`btn btn-lg text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.dugme_ispod_linije}`}>Pogledaj ponude</Link>
        </div>
        <div className={`col-xxl-6 col-xl-6 col-lg-6 col-md-7 col-sm-12`}>
          <ItemCard item={auction.item}/>
        </div>
      </div>
    </div>
  )
}

export default AuctionCard;