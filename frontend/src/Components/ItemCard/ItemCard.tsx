import { useEffect, useState } from "react";
import { getItemAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";
import { wrapText } from '../../Helpers/stringHelpers.ts';
import styles from "./ItemCard.module.css";

type Props = {
    id: string;
};

const DisplayItem = ({ id }: Props) => {
    const [item, setItem] = useState<Item | undefined>(undefined);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const loadItem = async () => {
        const response = await getItemAPI(Number(id));

        if (response && response.status == 200) {
            console.log(response);
            setItem(response.data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadItem();
    }, [id]);

    return (
        <div className={`container`}>
            {!isLoading ?
                (<>
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
                            <p className={`text-muted mb-2`}>{wrapText(item!.description, 50)}</p>
                            <p className={`badge bg-coral`}>{item?.category}</p>
                        </div>
                    </div>
                </>)
                :
                (<p className={`text-center text-muted`}>Ucitavanje...</p>)}
        </div>
    );
};

export default DisplayItem;
