import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./Context/useAuth";
import Navbar from "./Components/Navbar/Navbar";
import StranicaRegistracije from "./Components/StranicaRegistracije/StranicaRegistracije";
import StranicaPrijave from "./Components/StranicaPrijave/StranicaPrijave";
import Footer from './Components/Footer/Footer';
import { Toaster } from 'react-hot-toast';
import Home from './Components/Home/Home';

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <div className = "App">
            <Navbar/>
            <div className="content">
              <Routes>
                <Route path="/StranicaRegistracije" element={<StranicaRegistracije />} />
                <Route path="/StranicaPrijave" element={<StranicaPrijave />} />
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
