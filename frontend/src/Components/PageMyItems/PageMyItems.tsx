import styles from "./PageMyItems.module.css";
import { useEffect, useState } from 'react';
import { getItemsForUserAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";
import { useAuth } from "../../Context/useAuth";
import ItemCard from "../ItemCard/ItemCard";
import Pagination from "../Pagination/Pagination";

type Props = {
};

export const PageMyItems = (props: Props) => {
    const { user } = useAuth();
    const [items, setItems] = useState<Array<Item> | null>(null);
    const [totalItemsCount, setTotalItemsCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      loadItems(1, 10);
    }, []);

    const loadItems = async (page: number, pageSize: number) => {
        if (!user) return;
        try {
            const response = await getItemsForUserAPI(user.userName, page, pageSize);
            if (response && response.status === 200) {
                setItems(response.data.data);
                setTotalItemsCount(response.data.totalLength);
            }
        } catch (error) {
            console.error("Failed to load items:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaginateChange = async (page: number, pageSize: number) => {
      await loadItems(page, pageSize);
    }

    return (
        <div className={`container ${styles.pageMyItems} mb-4`}>
          <h1 className={`text-center text-steel-blue my-5`}>Moji predmeti</h1>
          {isLoading ? 
          (
            <p className={`text-center text-muted`}>Ucitavanje predmeta...</p>
          ) 
          : 
          <>
          {items && items.length > 0 ? (
            <div className={`row `}>
              {items.map((item) => (
                <div key={item.id} className={`col-xxl-3 col-xl-3 col-lg-6 col-md-6 col-sm-12 mb-4`}>
                  <ItemCard item={item} />
                  <div className={`d-flex justify-content-end`}>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={`text-center text-coral m-2`}>Nemate predmete za prikaz.</p>
          )
          }
          {totalItemsCount > 0 && 
          <div className="my-4">
            <Pagination totalLength={totalItemsCount} onPaginateChange={handlePaginateChange}/>
          </div>}
          </>}
        </div>
      );

}
export default PageMyItems