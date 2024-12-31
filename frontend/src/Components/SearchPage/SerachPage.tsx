import styles from "./SearchPage.module.css";
import { useEffect, useState } from 'react';
import { getAuctions, GetAuctionCounter, getAuctionsFromFilter } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";
import AuctionCard from "../AuctionCard/AuctionCard";
import { ItemCategory } from '../../Enums/ItemCategory';
import { useParams } from "react-router-dom";

type Props = {}

    const SearchPage = () => {
    const {id} = useParams();
  const [auctions, setAuctions] = useState<Array<Auction> | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(id ? parseInt(id, 10) : 1);
  const [auctionsPerPage, setAuctionsPerPage] = useState<number>(10);
  const [auctionsPerPageArray,setAuctionsPerPageArray]=useState<number[]>([5,10,15])
  const [category, setCategory] = useState<ItemCategory[]>([]);
  const [searchPrice, setSerachPrice] = useState<number>(0);
  const [serachName, setSearchName] = useState<string>("");

  
    const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchName(e.target.value);
    }
    const handleSearchPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const price = parseInt(e.target.value, 10); 
      setSerachPrice(isNaN(price) ? 0 : price);  
  }
  

    const changePageNumber = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      const valueString = e.currentTarget.getAttribute('data-value');
      const valueNumber = valueString !== null ? parseInt(valueString, 10) : 1;
      setCurrentPageNumber(valueNumber);
    }

    const changePageNumberPerPage = (e: React.MouseEvent<HTMLAnchorElement>) => {
      const selectedValue = e.currentTarget.getAttribute('data-value');
      if (selectedValue !== null && Number(selectedValue) !== auctionsPerPage) {
        setAuctionsPerPage(Number(selectedValue));
      }
    }


 const loadAuctionsWithoutFilter = async () => {
    const data = await getAuctions(auctionsPerPage*(currentPageNumber-1),auctionsPerPage);
    console.log(data);
    setAuctions(data);  
  };
  const loadAuctionsWithFilter = async () => {
    const response = await getAuctionsFromFilter(serachName, category, searchPrice);
    
    if (response && response.data) {
        setAuctions(response.data);  
    } else {
        setAuctions(null);  // Ako nema podataka, postavi null
    }
};


  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as ItemCategory;
    const isChecked = e.target.checked;
  
    if (isChecked) {
      setCategory((prev) => [...prev, value]);  
    } else {
      setCategory((prev) => prev.filter((cat) => cat !== value));  
    }
  };
  const handleButtonSearchClick=()=>
  {
    if (category.length<=0 && searchPrice<=0 && serachName=="")
    {
      loadAuctionsWithoutFilter();
    }
    else
    {
      loadAuctionsWithFilter();
    }
  }
  useEffect(()=>{
    loadAuctionsWithoutFilter();
  },[])

  useEffect(() => {
    if (category.length<=0 && searchPrice<=0 && serachName=="")
      {
        loadAuctionsWithoutFilter();
      }
      else
      {
        loadAuctionsWithFilter();
      }}, [currentPageNumber,auctionsPerPage]); 

  return (<>
    
    <div className={`m-2 dropdown`}>
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

<div>
  {Object.values(ItemCategory).map((category) => (
    <div key={category} className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        id={category}
        value={category}
        onChange={handleCategoryChange}
      />
      <label htmlFor={category}>{category}</label>
    </div>
  ))}
</div>
            <input
            className={`text-blue rounded-2`}
            value={serachName}
            onChange={handleSearchNameChange}
          ></input>
           <input
            className={`text-blue rounded-2`}
            value={searchPrice}
            onChange={handleSearchPriceChange}
          ></input>
            <button
    className={`rounded `}
    type="button"
    id="buttonSearch"
    onClick={handleButtonSearchClick}
  ></button>

<div className="auctions-list">
    {auctions && auctions.length > 0 ? (
        auctions.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
        ))
    ) : (
        <p>Nema aukcija.</p>  
    )}
</div>


  </>);
}
export default SearchPage;