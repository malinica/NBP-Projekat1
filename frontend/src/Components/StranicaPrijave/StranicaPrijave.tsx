import styles from "./StranicaPrijave.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { useAuth } from "../../Context/useAuth";

const StranicaPrijave = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const {loginUser, isLoggedIn} = useAuth();

  const handleLogin = async () => {
    
    try 
    {
      if (!(email.trim()) || !password) {
        console.log("Niste uneli e-mail i lozinku.");
        return;
      }
      await loginUser(email, password);
    } 
    catch (error) 
    {
      console.error(error);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); 
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value); 
  };

  const handlePasswordVisible = (state:boolean) => {
    setPasswordVisible(state);
  }

  return (
    <div className={`container-fluid bg-powder d-flex justify-content-center flex-grow-1`}>
      <div className={`row container-fluid d-flex justify-content-center`}>
        <div className={`col-xxl-4 col-xl-5 col-lg-6 col-md-7 col-sm-8 p-5 m-4 bg-light rounded d-flex flex-column`}>
            <div className={`m-5`}></div>
            <h4 className={`text-blue text-center`}>Prijavite Se</h4>
            <h6 className={`text-powder text-center mb-3`}>Dobrodošli nazad!</h6>
            <div className={`form-floating mb-2 mt-2`}>
              <input type="email" className={`form-control ${styles.fields}`} id="email" placeholder="Unesite e-mail" name="email" value={email} onChange={handleEmailChange} required />
              <label htmlFor="email" className={`${styles.input_placeholder}`}>Unesite e-mail</label>
            </div>
            <div className={`form-floating mb-2 mt-2`}>
              <input type={passwordVisible ? "text" : "password"} className={`form-control ${styles.fields}`} id="password" placeholder="Unesite lozinku" name="password" value={password} onChange={handlePasswordChange} required />
              <label htmlFor="password" className={`${styles.input_placeholder}`}>Unesite lozinku</label>
              {passwordVisible ? 
              <FontAwesomeIcon icon={faEyeSlash} className={`${styles.password_eye}`} onClick={() => handlePasswordVisible(false)}/> :
              <FontAwesomeIcon icon={faEye} className={`${styles.password_eye}`} onClick={() => handlePasswordVisible(true)}/>}
            </div>
            <button className={`mt-5 rounded-3 bg-blue p-3 mt-2 border-0 text-light ${styles.dugme}`} onClick={handleLogin}>Prijavite Se</button>
            <p className={`text-blue mt-2 mb-6 text-center`}>
              Nemate nalog?&nbsp;
              <Link className={`text-blue text-decoration-none`} to="/StranicaRegistracije">Registrujte se.</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default StranicaPrijave;
