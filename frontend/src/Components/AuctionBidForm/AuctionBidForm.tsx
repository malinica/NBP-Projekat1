import React, { FormEvent, useState } from "react";

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
      <div>
        <label htmlFor="bid">Unesite vašu ponudu:</label>
        <input
          type="number"
          id="bid"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          placeholder="Unesite iznos"
          min="1"
          step="1"
          required
        />
      </div>
      <button type="submit" className="bg-info">Licitiraj</button>
    </form>
  );
};

export default AuctionBidForm;
