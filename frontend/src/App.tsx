import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { UserProvider } from "./Context/useAuth";
import Navbar from "./Components/Navbar/Navbar";
import StranicaRegistracije from "./Components/StranicaRegistracije/StranicaRegistracije";
import StranicaPrijave from "./Components/StranicaPrijave/StranicaPrijave";

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
          </div>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
