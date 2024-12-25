import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getItemAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";

type Props = {};

const DisplayItem = (props: Props) => {
  const { id } = useParams();

  const [item, setItem] = useState<Item|undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadItem = async () => {
    const response = await getItemAPI(Number(id));

    if(response && response.status == 200) {
        console.log(response);
        setItem(response.data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadItem();
  }, []);

  return (
    <div className="container">
        {!isLoading ? 
        (<>
            <div className="row">
                <div className="col-6">
                    <div id="carouselExampleIndicators" className="carousel slide">
                    <div className="carousel-indicators">
                        {item?.pictures.map((_, i) =>
                            <button type="button" key={i} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={`${i}`} className={`${i==0 ? 'active':''}`}></button>
                        )}
                    </div>
                    <div className="carousel-inner">
                        {item?.pictures.map((pictureName, i) => (
                            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                                <img src={`${import.meta.env.VITE_API_URL}/${pictureName}`} className="d-block w-100" alt="..."/>
                            </div>
                            ) 
                        )}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                    </div>
                </div>
                <div className="col-6">
                    <p>{item?.name}</p>
                    <p>{item?.description}</p>
                    <p>{item?.category}</p>
                </div>
            </div>
            
        </>) 
        : 
        (<p>Loading...</p>)}
    </div>
  );
};

export default DisplayItem;
