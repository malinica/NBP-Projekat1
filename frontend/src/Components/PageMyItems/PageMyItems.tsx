import styles from "./PageMyItems.module.css";
import { useEffect, useState } from 'react';
import { getItemsForUserAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";
import { useAuth } from "../../Context/useAuth";
import ItemCard from "../ItemCard/ItemCard";
import { useNavigate } from "react-router-dom";
import { createAuctionAPI } from "../../Services/AuctionService";
import toast from "react-hot-toast";

type Props = {
  item?: Item;
};

export const PageMyItems = ({item}: Props) => {
    const { isLoggedIn, user } = useAuth();
    const [items, setItems] = useState<Array<Item> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [price, setPrice] = useState("");

    const loadItems = async () => {
        if (!user) return;
        try {
            const response = await getItemsForUserAPI(user.userName);
            if (response && response.status === 200) {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Failed to load items:", error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if (isLoggedIn()) {
            loadItems();
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return <p className="text-center text-danger">Trebate da se ulogujuete da bi ste videli iteme.</p>;
    }

    const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async () => {
      const username = user?.userName;

      const auctionData = {
          title,
          startingPrice: parseFloat(price),
          currentPrice: parseFloat(price),
          status: 0,
          postedOnDate: new Date().toISOString(),
          dueTo: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
          itemId: item?.id
      };

      try {
          const auctionId = await createAuctionAPI(username!, auctionData);
          toast.success("Aukcija je uspesno kreirana!");
          navigate(`../auctions/${auctionId}`);
          closeModal();
      } catch (error) {
          console.error("Greska prilikom kreiranja aukcije:", error);
      }
  };

    return (
        <div className={`container ${styles.pageMyItems} mb-4`}>
          {isLoading ? (
            <p className="text-center text-muted">Ucitavanje itema...</p>
          ) : items && items.length > 0 ? (
            <div className="row">
              {items.map((item) => (
                <div key={item.id} className="col-12 cursor-pointer">
                  <ItemCard item={item} />
                  <div className={`d-flex justify-content-end`}>
                  <button onClick={openModal} className={`btn btn-sm w-50 m-3 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`}>
                    Postavi na aukciju
                  </button>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <p className="text-center text-muted">Nemate iteme za prikaz.</p>
          )}
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

}
export default PageMyItems