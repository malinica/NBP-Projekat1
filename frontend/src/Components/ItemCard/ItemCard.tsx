import { Item } from "../../Interfaces/Item/Item";
import styles from "./ItemCard.module.css";
import { Link } from "react-router-dom";

type Props = {
    item: Item;
};

const ItemCard = ({ item }: Props) => {
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
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
