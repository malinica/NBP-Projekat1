import styles from "./StranicaAukcija.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { useAuth } from "../../Context/useAuth";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { AuctionStatus } from "../../Enums/AuctionStatus";

const StranicaAukcija = () => {
    //const { isLoggedIn, user } = useAuth();
    return (
        <div>
          <h1>Aukcija</h1>
          <p>Detalji aukcije...</p>
        </div>
      );
}
export default StranicaAukcija;
