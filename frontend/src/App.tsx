import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./Context/useAuth";
import Navbar from "./Components/Navbar/Navbar";
import StranicaRegistracije from "./Components/StranicaRegistracije/StranicaRegistracije";
import StranicaAukcija from "./Components/StranicaAukcija/StranicaAukcija";
import StranicaPrijave from "./Components/StranicaPrijave/StranicaPrijave";
import Footer from './Components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import Home from "./Components/Home/Home";
import CreateItem from "./Components/CreateItem/CreateItem";

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
                <Route path="/register" element={<StranicaRegistracije />} />
                <Route path="/login" element={<StranicaPrijave />} />
                <Route path="/auctions" element={<StranicaAukcija />} />
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
