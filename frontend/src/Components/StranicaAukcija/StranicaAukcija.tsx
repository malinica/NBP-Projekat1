import styles from "./StranicaAukcija.module.css";
import { useEffect, useState } from 'react';
import { getAuctions, GetAuctionCounter } from "../../Services/AuctionService";
import { Auction } from "../../Interfaces/Auction/Auction";


const AuctionPage = () => {
  const [auctions, setAuctions] = useState<Array<Auction> | null>(null);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [auctionsPerPage, setAuctionsPerPage] = useState<number>(5);
  const [auctionCounter,setAuctionCounter]=useState<number>(0);
  const [pages, setPages] = useState<Number[]>([1]);
  const [auctionsPerPageArray,setAuctionsPerPageArray]=useState<number[]>([5,10,15])


  const calculateNumberOfPages = () => {
    var p = (auctionCounter / auctionsPerPage) + 1;
    const str = [];
    for (let i = 1; i <= p; i++) {
      str.push(i);
    }
    setPages(str);
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

  const loadAuctionCounter = async () => {
    const data = await GetAuctionCounter();
    if (data!=null)
    setAuctionCounter(data);  
  };

 const loadAuctions = async () => {
    const data = await getAuctions(auctionsPerPage*(currentPageNumber-1),auctionsPerPage);
    setAuctions(data);  
  };

  useEffect(()=>{
  loadAuctions();
  loadAuctionCounter();
  calculateNumberOfPages();
  },[])

  useEffect(() => {
    loadAuctions();  
}, [currentPageNumber,auctionsPerPage,auctionCounter]); 

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

    
    <nav className={`mt-2 me-2 d-flex justify-content-end`}>
              <ul className={`pagination`}>
                {currentPageNumber != 1 && (
                  <>
                    <li className={`page-item`}>
                      <a
                        className={`page-link`}
                        data-value={currentPageNumber - 1}
                        onClick={(e) => {
                          changePageNumber(e);
                        }}
                      >
                        Previous
                      </a>
                    </li>
                  </>
                )}
                

                {pages.map((pageN) => (
                  <li key={`PageNumber-${pageN}`} className={`${pageN === currentPageNumber ? 'page-item active' : 'page-item'}`}>
                    <a
                      data-value={pageN}
                      className={`page-link`}
                      onClick={(e) => {
                        changePageNumber(e);
                      }}
                    >
                      {pageN.toString()}
                    </a>
                  </li>
                ))}
                {currentPageNumber != pages[pages.length-1] && (
                  <>
                    <li className={`page-item`}>
                      <a
                        className={`page-link`}
                        data-value={currentPageNumber + 1}
                        onClick={(e) => {
                          changePageNumber(e);
                        }}
                      >
                        Next
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </nav>
  </>);
}
export default AuctionPage;