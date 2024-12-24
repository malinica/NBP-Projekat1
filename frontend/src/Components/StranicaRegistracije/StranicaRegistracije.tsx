import React, { useState } from "react";
import styles from "./StranicaRegistracije.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../../Context/useAuth";
import { proveriEmailAPI, proveriUsernameAPI } from "../../Services/AuthService";

type Props = {};

const StranicaRegistracije = (props: Props) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const { registerUser } = useAuth();

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordVisible = (state: boolean) => {
    setPasswordVisible(state);
  }

  const handleRegister = async () => {
    let trimmedEmail = email.trim();
    let trimmedUsername = username.trim();
    setEmail(trimmedEmail);
    setUsername(trimmedUsername);

    if (!trimmedEmail || !password || !trimmedUsername) {
      console.log("Niste popunili sva polja.")
      return;
    }

    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if(!usernameRegex.test(trimmedUsername)){
      console.log("Korisničko ime nije u validnom formatu. Dozvoljena su mala i velika slova abecede, brojevi, _ i .");
      return;
    }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
      console.log("Uneti e-mail nije validan.");
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[!@#-/+$%^&*(),.?":{}|<>])(?=.*[A-Z]).{8,}$/;
    if(!passwordRegex.test(password)){
      console.log("Lozinka mora da bude dužine barem 8 karaktera, da sadrži cifru, specijalni znak i veliko slovo.");
      return;
    }

    try {
      const usernameRes = await proveriUsernameAPI(trimmedUsername);
      if(usernameRes && usernameRes.status===200){
        if(usernameRes.data===true){
          console.log("Izabrano korisničko ime je već zauzeto.");
          return;
        }
      }

      const emailRes = await proveriEmailAPI(trimmedEmail);
      if(emailRes && emailRes.status===200){
        if(emailRes.data===true){
          console.log("Već postoji korisnički nalog sa unetim e-mail-om.");
          return;
        }
      }

      await registerUser(email, username, password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={`container-fluid bg-powder d-flex justify-content-center flex-grow-1`}>
      <div className={`col-xxl-4 col-xl-5 col-lg-6 col-md-7 col-sm-8 p-5 m-4 bg-light rounded d-flex flex-column`}>
        <h4 className={`mt-5 text-blue text-center`}>Registrujte Se</h4>
        <h6 className={`text-powder text-center mb-3`}>Dobrodošli!</h6>
        <div className={`form-floating mb-2 mt-2`}>
          <input
            type="text"
            className={`form-control ${styles.fields}`}
            id="username"
            placeholder="Unesite korisničko ime"
            onChange={handleUsernameChange}
            name="username"
            value={username}
            required
          />
          <label htmlFor="username" className={`${styles.input_placeholder}`}>
            Unesite korisničko ime
          </label>
        </div>
        <div className={`form-floating mb-2 mt-2`}>
          <input
            type="email"
            className={`form-control ${styles.fields}`}
            id="email"
            placeholder="Unesite e-mail"
            onChange={handleEmailChange}
            name="email"
            value={email}
            required
          />
          <label htmlFor="email" className={`${styles.input_placeholder}`}>
            Unesite e-mail
          </label>
        </div>
        <div className={`form-floating mb-2 mt-2`}>
          <input
            type={passwordVisible ? "text" : "password"}
            className={`form-control ${styles.fields}`}
            id="password"
            placeholder="Unesite lozinku"
            onChange={handlePasswordChange}
            name="password"
            value={password}
            required
          />
          <label htmlFor="password" className={`${styles.input_placeholder}`}>
            Unesite lozinku
          </label>
          {passwordVisible ?
            <FontAwesomeIcon icon={faEyeSlash} className={styles.password_eye} onClick={() => handlePasswordVisible(false)} /> :
            <FontAwesomeIcon icon={faEye} className={styles.password_eye} onClick={() => handlePasswordVisible(true)} />}
        </div>
        <button
          className={`rounded-3 bg-blue p-3 mt-2 border-0 text-light ${styles.dugme}`}
          onClick={handleRegister}
        >
          Registrujte Se
        </button>
        <p className={`text-blue mt-2 text-center`}>
          Imate nalog?&nbsp;
          <Link
            className={`text-blue text-decoration-none`}
            to="/StranicaPrijave"
          >
            Prijavite se.
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StranicaRegistracije;
