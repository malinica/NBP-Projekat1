import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./Context/useAuth";
import Navbar from "./Components/Navbar/Navbar";
import StranicaRegistracije from "./Components/StranicaRegistracije/StranicaRegistracije";
import SearchPage from "./Components/SearchPage/SerachPage";
import StranicaPrijave from "./Components/StranicaPrijave/StranicaPrijave";
import PageMyItems from "./Components/PageMyItems/PageMyItems";

import Footer from './Components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import Home from "./Components/Home/Home";
import CreateItem from "./Components/CreateItem/CreateItem";
import DisplayItem from "./Components/DisplayItem/DisplayItem";
import AuctionPage from "./Components/Auction/AuctionPage";
import FavoriteAuctionsPage from "./Components/FavoriteAuctionsPage/FavoriteAuctionsPage";


function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <div className = "App">
            <Navbar/>
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-item" element={<CreateItem />} />
                <Route path="/items/:id" element={<DisplayItem />} />
                <Route path="/register" element={<StranicaRegistracije />} />
                <Route path="/login" element={<StranicaPrijave />} />
                <Route path="/search-page/:id" element={<SearchPage />} />
                <Route path="/auctions/:id" element={<AuctionPage />} />
                <Route path="/my-items" element={<PageMyItems />} />
                <Route path="/favorite-auctions" element={<FavoriteAuctionsPage />} />
              </Routes>
            </div>
            <Footer />
            <Toaster position='top-center' reverseOrder={false} />
          </div>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
