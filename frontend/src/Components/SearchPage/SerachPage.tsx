import styles from "./SearchPage.module.css";
import { useEffect, useState } from 'react';
import { getAuctions, getAuctionsFromFilter } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";
import AuctionCard from "../AuctionCard/AuctionCard";
import { ItemCategory } from '../../Enums/ItemCategory';
import { useParams } from "react-router-dom";


type Props = {};

  const SearchPage = () => {
    const { id } = useParams();
    const [auctions, setAuctions] = useState<Array<Auction> | null>(null);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(id ? parseInt(id, 10) : 1);
    const [auctionsPerPage, setAuctionsPerPage] = useState<number>(10);
    const [auctionsPerPageArray, setAuctionsPerPageArray] = useState<number[]>([5, 10, 15,]);
    const [category, setCategory] = useState<ItemCategory[]>([]);
    const [minPrice, setMinPrice] = useState<number|null>(null);
    const [maxPrice, setMaxPrice] = useState<number|null>(null);
    const [serachName, setSearchName] = useState<string>("");
    const [filter,setFilter]=useState<boolean>(false);// da li je pretraga po filteru ili obicna

    const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchName(e.target.value);
    };

    const handleMaxPrice = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const price = parseInt(e.target.value, 10);
      setMaxPrice(isNaN(price) ? null : price);
    };

    const handleMinPrice = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const price = parseInt(e.target.value, 10);
      setMinPrice(isNaN(price) ? null : price);
    };

    const changePageNumber = (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      const valueString = e.currentTarget.getAttribute("data-value");
      const valueNumber = valueString !== null ? parseInt(valueString, 10) : 1;
      setCurrentPageNumber(valueNumber);
      window.history.pushState({}, '', `http://localhost:5173/search-page/${valueNumber}`);

    };

    const changePageNumberPerPage = (
      e: React.MouseEvent<HTMLAnchorElement>
    ) => {
      const selectedValue = e.currentTarget.getAttribute("data-value");
      if (selectedValue !== null && Number(selectedValue) !== auctionsPerPage) {
        setAuctionsPerPage(Number(selectedValue));
      }
    };

    const loadAuctionsWithoutFilter = async () => {
      const data = await getAuctions(
        auctionsPerPage * (currentPageNumber - 1),
        auctionsPerPage
      );
      setAuctions(data);
      setFilter(false);
    };

    const loadAuctionsWithFilter = async () => {
      const response = await getAuctionsFromFilter(serachName,category,minPrice,maxPrice);

      if (response && response.data) {
        setAuctions(response.data);
      } else {
        setAuctions(null);
      }
        setFilter(true);
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

    const handleButtonSearchClick = () => {
      if (category.length <= 0 && minPrice ==null && maxPrice ==null && serachName=="") {
        loadAuctionsWithoutFilter();
      } else {
        loadAuctionsWithFilter();
      }
      setCurrentPageNumber(1);
    };
    useEffect(() => {
      loadAuctionsWithoutFilter();
    }, []);

    useEffect(() => {
      if (category.length <= 0 && minPrice ==null && maxPrice ==null && serachName=="") {
        loadAuctionsWithoutFilter();
        
      } else {
        if(filter==false)
        {
          loadAuctionsWithFilter();
        }
      }
    }, [currentPageNumber, auctionsPerPage]);


return (
    <div className={`container`}>
      <div className={`row`}>
        <div className={`col-xxl-3 col-xl-3 col-lg-4 col-md-5 col-sm-12 my-2 mr-2`}>
          <div className={`m-2 px-2 py-3 bg-steel-blue rounded-3 d-flex flex-column`}>
            <label className={`mx-2 text-cyan-blue`}>Odaberite kategoriju: </label>
            {Object.values(ItemCategory).map((category) => (
              <div key={category} className={`m-2 text-coral`}>
                <input
                  type="checkbox"
                  id={category}
                  value={category}
                  onChange={handleCategoryChange}
                />
                <label htmlFor={category}>{category}</label>
              </div>
            ))}

            <label className={`mx-2 text-cyan-blue`}>Unesite naziv predmeta: </label>
            <div className={`d-flex flex-column ms-2 me-2 my-2`}>
              <input
                className={`form-control rounded-2`}
                value={serachName}
                onChange={handleSearchNameChange}
              ></input>
            </div>
            <label className={`mx-2 text-cyan-blue`}>Unesite minimalnu cenu: </label>
            <div className={`d-flex flex-column ms-2 me-2 my-2`}>
              <input
                className={`form-control rounded-2`}
                value={minPrice || ''}
                onChange={handleMinPrice}
              ></input>
            </div>
            <label className={`mx-2 text-cyan-blue`}>Unesite maksimalnu cenu: </label>
            <div className={`d-flex flex-column ms-2 me-2 my-2`}>
              <input
                className={`form-control rounded-2`}
                value={maxPrice || ''}
                onChange={handleMaxPrice}
              ></input>
            </div>

            <button
              className={`btn-md m-2 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}
              type="button"
              id="buttonSearch"
              onClick={handleButtonSearchClick}
            >Pretraži Aukcije</button>
          </div>
        </div>

        <div className={`col-xxl-8 col-xl-8 col-lg-7 col-md-6 col-sm-12 m-2`}>
  {(filter) ? (
    <div className="auctions-list">
      {auctions && auctions.length > 0 ? (
        auctions
        .slice((currentPageNumber - 1) * auctionsPerPage, currentPageNumber * auctionsPerPage)
        .map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))
      ) : (
        <p>Nema aukcija.</p>
      )}
    </div>
  ) : (
    <div className="auctions-list">
      {auctions && auctions.length > 0 ? (
        auctions
        .map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))
      ) : (
        <p className={`text-center text-coral m-2`}>Nema aukcija.</p>
      )}
    </div>
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
                  (filter && auctions && ((auctions.length-currentPageNumber*auctionsPerPage)>0) ) ||
                  (!filter && auctions && auctions.length==auctionsPerPage)
                ) && (
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

      </div>
    </div>
  );
}

export default SearchPage;