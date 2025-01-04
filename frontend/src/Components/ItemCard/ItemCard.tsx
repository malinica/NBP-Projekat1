import { Item } from "../../Interfaces/Item/Item";
import styles from "./ItemCard.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { createAuctionAPI } from "../../Services/AuctionService";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/useAuth";
import { useState } from 'react';
import DatePicker from "react-datepicker";

type Props = {
    item: Item;
};

const ItemCard = ({ item }: Props) => {
        const [isModalOpen, setModalOpen] = useState(false);
        const [title, setTitle] = useState("");
        const [price, setPrice] = useState("");
        const [dueDate, setDueDate] = useState<Date | null>(null);
    
        const {user} = useAuth();
    
        const navigate = useNavigate();

        const openModal = () => setModalOpen(true);
        const closeModal = () => setModalOpen(false);
      
        const handleSubmit = async () => {
            const username = user?.userName;

            if (!title || !price || !dueDate) {
                toast.error("Molimo popunite sva obavezna polja!");
                return;
            }
      
            const auctionData = {
                title,
                startingPrice: parseFloat(price),
                currentPrice: parseFloat(price),
                status: 0,
                postedOnDate: new Date().toISOString(),
                dueTo: dueDate?.toISOString(),                
                itemId: item.id
            };
      
            try {
                const response = await createAuctionAPI(username!, auctionData);
                if(response && response.status === 200) {
                    toast.success("Aukcija je uspešno kreirana!");
                    navigate(`../auctions/${response.data.id}`);
                    closeModal();
                }
            } catch (error) {
                console.error("Greska prilikom kreiranja aukcije:", error);
                toast.error("Došlo je do greške prilikom kreiranja aukcije. Pokušajte ponovo.");
            }
        };

    return (
        <div className={`container`}>
            <div className={`row bg-baby-blue rounded-3 py-3 m-2`}>
                <img
                    src={`${import.meta.env.VITE_API_URL}/${item?.pictures[0]}`}
                    className={`img-fluid ${styles.slika} px-2 mb-2`}
                    alt="Prva slika"
                />
                <p className={`text-steel-blue`}>{item?.name}
                    <span className={`badge bg-coral mx-2`}>{item?.category}</span>
                </p>
                <p>Autor: <Link to={`/users/${item.author.userName}`}>{item.author.userName}</Link></p>
                {item.auctionWinner && <p>Pobednik aukcije: <Link to={`/users/${item.auctionWinner.userName}`}>{item.auctionWinner.userName}</Link></p>}
                <div className={`d-flex w-100`}>
                    <Link to={`/items/${item.id}`} className={`btn btn-sm w-50 m-2 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`} >Detaljnije o predmetu</Link>
                    {item.author.id == user?.id && <button onClick={openModal} className={`btn btn-sm w-50 m-2 text-white text-center rounded py-2 px-2 ${styles.dugme4} ${styles.linija_ispod_dugmeta}`}>
                        Postavi na aukciju
                    </button>}
                </div>
            </div>
            {isModalOpen && (
                <div className={`modal d-block`} style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className={`modal-dialog`}>
                        <div className={`modal-content`}>
                            <div className={`modal-header`}>
                                <h5 className={`modal-title text-metal`}>Postavi na aukciju</h5>
                                <button type="button" className={`btn-close`} onClick={closeModal}></button>
                            </div>
                            <div className={`modal-body`}>
                                <form>
                                    <div className={`mb-3`}>
                                        <label htmlFor="title" className={`form-label text-steel-blue`}>Naslov</label>
                                        <input
                                            type="text"
                                            className={`form-control`}
                                            id="title"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className={`form-label text-steel-blue`}>Pocetna cena</label>
                                        <input
                                            type="number"
                                            className={`form-control`}
                                            id="price"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dueDate" className={`form-label text-steel-blue me-2`}>Datum završetka aukcije</label>
                                        <DatePicker
                                            selected={dueDate}
                                            onChange={(date:any) => setDueDate(date)}
                                            dateFormat="yyyy-MM-dd"
                                            className="form-control"
                                            minDate={new Date()} 
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className={`btn btn-sm m-2 text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`} onClick={closeModal}>
                                    Zatvori
                                </button>
                                <button type="button" className={`btn btn-sm m-2 text-white text-center rounded py-2 px-2 ${styles.dugme3} ${styles.linija_ispod_dugmeta}`} onClick={handleSubmit}>
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
