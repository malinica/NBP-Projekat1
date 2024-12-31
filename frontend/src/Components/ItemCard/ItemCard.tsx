import { Item } from "../../Interfaces/Item/Item";
import styles from "./ItemCard.module.css";
import { Link } from "react-router-dom";

type Props = {
    item: Item;
};

const ItemCard = ({ item }: Props) => {
    return (
        <div className={`container`}>
            <div className={`row bg-baby-blue rounded-3 py-3 m-2`}>
                <img
                    src={`${import.meta.env.VITE_API_URL}/${item?.pictures[0]}`}
                    className={`img-fluid`}
                    alt="Prva slika"
                />
                <p className={`text-steel-blue`}>{item?.name}
                    <p className={`badge bg-coral mx-2`}>{item?.category}</p>
                </p>
                <Link to={`/items/${item.id}`} className={`btn btn-sm w-50 m-2 text-white text-center rounded py-2 px-2 ${styles.dugme1} ${styles.linija_ispod_dugmeta}`} >Detaljnije o predmetu</Link>
            </div>
        </div>
    );
};

export default ItemCard;
