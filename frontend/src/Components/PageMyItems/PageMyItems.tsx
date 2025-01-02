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
};

export const PageMyItems = (props: Props) => {
    const { isLoggedIn, user } = useAuth();
    const [items, setItems] = useState<Array<Item> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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
        return <p className={`text-center text-danger`}>Trebate da se ulogujuete da bi ste videli iteme.</p>;
    }

    return (
        <div className={`container ${styles.pageMyItems} mb-4`}>
          <h1 className={`text-center text-steel-blue m-2`}>Moji predmeti</h1>
          {isLoading ? (
            <p className={`text-center text-muted`}>Ucitavanje predmeta...</p>
          ) : items && items.length > 0 ? (
            <div className={`row`}>
              {items.map((item) => (
                <div key={item.id} className={`col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4 cursor-pointer`}>
                  <ItemCard item={item} />
                  <div className={`d-flex justify-content-end`}>
                  </div>
                </div>
              ))}

            </div>
          ) : (
            <p className={`text-center text-coral m-2`}>Nemate predmete za prikaz.</p>
          )}
        </div>
      );

}
export default PageMyItems