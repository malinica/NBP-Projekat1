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
import UserProfilePage from "./Components/UserProfilePage/UserProfilePage";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";


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
                <Route path="/create-item" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
                <Route path="/items/:id" element={<ProtectedRoute><DisplayItem /></ProtectedRoute>} />
                <Route path="/register" element={<StranicaRegistracije />} />
                <Route path="/login" element={<StranicaPrijave />} />
                <Route path="/search-page/:id" element={<SearchPage />} />
                <Route path="/auctions/:id" element={<ProtectedRoute><AuctionPage /></ProtectedRoute>} />
                <Route path="/my-items" element={<ProtectedRoute><PageMyItems /></ProtectedRoute>} />
                <Route path="/favorite-auctions" element={<ProtectedRoute><FavoriteAuctionsPage/></ProtectedRoute>} />
                <Route path="/users/:username" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
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
