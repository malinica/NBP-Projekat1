import React from 'react'
import { Auction } from '../../Interfaces/Auction/Auction'
import ItemCard from '../ItemCard/ItemCard'
import { Link } from 'react-router-dom'

type Props = {
    auction: Auction, 
}

const AuctionCard = ({auction}: Props) => {
  return (
    <div className='m-2 p-2 rounded-2 border border-2'>
        <h5>{auction.title}</h5>
        <p>Starting price: {auction.startingPrice}</p>
        <p>Current price: {auction.currentPrice}</p>
        <p>Status: {auction.status}</p>
        <p>Posted on: {new Date(auction.postedOnDate).toLocaleString("sr")}</p>
        <p>Due to: {new Date(auction.dueTo).toLocaleString("sr")}</p>
        <ItemCard item={auction.item}/>
        <Link to={`/auctions/${auction.id}`} className='btn btn-primary'>Pogledaj ponude</Link>
    </div>
  )
}

export default AuctionCard