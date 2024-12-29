import React, { FormEvent, useState } from "react";
import styles from "./AuctionBidForm.module.css";

type Props = {
    onSubmitBid: (bid: number) => void;
};

const AuctionBidForm = ({onSubmitBid}:Props) => {
  const [bid, setBid] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const bidValue = parseFloat(bid);
    if (isNaN(bidValue) || bidValue <= 0) {
      alert("Molimo unesite validnu ponudu veću od 0.");
      return;
    }
    onSubmitBid(bidValue);
    setBid("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={`row align-items-center`}>
        <div className={`col-auto`}>
          <label htmlFor="bid" className={`lead form-label text-metal`}>Unesite vašu ponudu: </label>
        </div>
        <div className={`col`}>
          <input
            type="number"
            id="bid"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Unesite iznos"
            className={`rounded-3 form-control`}
            min="1"
            step="1"
            required
          />
        </div>
        <div className={`col`}>
          <button type="submit" className={`rounded-3 bg-blue p-3 border-0 text-light ${styles.dugme}`}>Licitiraj</button>
        </div>
      </div>
    </form>
  );
};

export default AuctionBidForm;
