import { useState } from "react";
import { Item } from "../../Interfaces/Item/Item";
import styles from "./ItemCard.module.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

type Props = {
    item: Item;
};

const ItemCard = ({ item }: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const handleSubmit = async () => {
        const username = localStorage.getItem("username");
        if (!username) {
            console.error("Korisnik nije ulogovan");
            return;
        }

        const auctionData = {
            title,
            startingPrice: parseFloat(price),
            currentPrice: parseFloat(price),
            status: 0,
            postedOnDate: new Date().toISOString(),
            dueTo: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
            itemId: item.id
        };

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/Auction/set?username=${username}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(auctionData),
                }
            );
            if (!response.ok) {
                throw new Error(`Greska: ${response.statusText}`);
            }
            toast.success("Aukcija je uspesno kreirana!");
            closeModal();
        } catch (error) {
            console.error("Greska prilikom kreiranja aukcije:", error);
        }
    };


    return (
        <div className={`container`}>
            <div className={`row justify-content-center align-items-center bg-baby-blue p-4 mt-4 ${styles.borderRadius}`}>
                <div className={`col-lg-6 mb-lg-0`}>
                    <img
                        src={`${import.meta.env.VITE_API_URL}/${item?.pictures[0]}`}
                        className={`d-block ${styles.imgSize}`}
                        alt="Prva slika"
                    />
                </div>
                <div className={`col-lg-6 text-lg-start text-center`}>
                    <p className={`text-primary mb-3`}>{item?.name}</p>
                    <p className={`badge bg-coral`}>{item?.category}</p>
                    <Link to={`/items/${item.id}`} className={`btn btn-primary mt-3 d-block`} >Detaljnije o predmetu</Link>
                    <button onClick={openModal} className={`btn btn-secondary mt-3 d-block`}>
                        Postavi na aukciju
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <div className={`modal d-block`} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Postavi na aukciju</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="title" className="form-label">Naslov</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Pocetna cena</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                                    Zatvori
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Postavi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItemCard;
