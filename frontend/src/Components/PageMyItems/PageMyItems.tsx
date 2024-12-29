import styles from "./PageMyItems.module.css";
import { useEffect, useState } from 'react';
import { getItemsForUserAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";
import { useAuth } from "../../Context/useAuth";


export const PageMyItems = () => {
    const { isLoggedIn, user } = useAuth();
    const [items, setItems] = useState<Array<Item> | null>(null);

    const loadItems = () => {
        getItemsForUserAPI(user!.userName)
        .then(response => {
            if (response) 
            {
                setItems(response.data);
                console.log(response.data);
            }
        })
        }
        useEffect(() => {
            loadItems();
      }, []);


    return (<></>);

}
export default PageMyItems