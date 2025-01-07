import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemAPI, deleteItemAPI, updateItemAPI } from "../../Services/ItemService";
import { Item } from "../../Interfaces/Item/Item";
import { wrapText } from '../../Helpers/stringHelpers.ts';
import toast from "react-hot-toast";
import styles from "./DisplayItem.module.css";
import { ItemCategory } from "../../Enums/ItemCategory.ts";

type Props = {};

const DisplayItem = (props: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item|undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [updatedName, setUpdatedName] = useState<string>("");
  const [updatedDescription, setUpdatedDescription] = useState<string>("");
  const [updatedCategory, setUpdatedCategory] = useState<ItemCategory>(ItemCategory.Electronics);
  const [updatedPictures, setUpdatedPictures] = useState<FileList | null>(null);
  
  const loadItem = async () => {
    const response = await getItemAPI(Number(id));

    if(response && response.status == 200) {
        setItem(response.data);
        setUpdatedName(response.data.name);
        setUpdatedDescription(response.data.description);
        setUpdatedCategory(response.data.category);
    }
    setIsLoading(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setUpdatedCategory(e.target.value as ItemCategory);
  };

  const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUpdatedPictures(e.target.files);
    }
  };

  const handleDelete = async () => {
    try {
      if (window.confirm("Da li ste sigurni da želite da obrišete predmet?")) {
        const response = await deleteItemAPI(Number(id));
        if (response && response.status === 200) {
          toast.success("Predmet je uspešno obrisan!");
          navigate("/my-items"); 
        }
      }
    } catch (error) {
      toast.error("Neuspešno brisanje predmeta. Pokušajte ponovo.");
    }
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", updatedName);
      formData.append("description", updatedDescription);
      formData.append("category", updatedCategory);

      if (updatedPictures) {
        Array.from(updatedPictures).forEach((file) => {
          formData.append("pictures", file);
        });
      }

      const response = await updateItemAPI(Number(id), formData);
      if (response && response.status == 200) {
        toast.success("Predmet uspešno ažuriran!");
        setEditMode(false);
        setItem(response.data);
      }
    } catch (error) {
      toast.error("Neuspešno ažuriranje predmeta. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    loadItem();
  }, []);

  return (
    <div className={`container`}>
        {!isLoading && item ? 
        (<>
            <div className={`row justify-content-center align-items-center`}>
                <div className={`col-lg-6 my-4 img-fluid`}>
                    <div id="carouselExampleIndicators" className={`carousel slide shadow rounded overflow-hidden`}>
                    <div className={`carousel-indicators`}>
                        {item?.pictures.map((_, i) =>
                            <button type="button" key={i} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={`${i}`} className={`${i==0 ? 'active':''}`}></button>
                        )}
                    </div>
                    <div className={`carousel-inner`}>
                        {item?.pictures.map((pictureName, i) => (
                            <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={i}>
                                <img src={`${import.meta.env.VITE_API_URL}/${pictureName}`} className={`d-block w-100`} alt="..."/>
                            </div>
                            ) 
                        )}
                    </div>
                    <button className={`carousel-control-prev`} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                        <span className={`carousel-control-prev-icon`} aria-hidden="true"></span>
                        <span className={`visually-hidden`}>Previous</span>
                    </button>
                    <button className={`carousel-control-next`} type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                        <span className={`carousel-control-next-icon`} aria-hidden="true"></span>
                        <span className={`visually-hidden`}>Next</span>
                    </button>
                    </div>
                </div>
                <div className={`col-lg-6 text-lg-start text-center`}>
                {!editMode ? (
                    <div className={`d-flex flex-column align-items-start`}>
                        <p className={`text-steel-blue mb-3`}>{item?.name}</p>
                        <p className={`text-muted mb-2`}>
                            {wrapText(item?.description || "", 50)}
                        </p>
                        <p className={`badge bg-coral`}>{item?.category}</p>
                        <button
                            className={`btn btn-sm my-2 text-white text-center rounded py-2 px-2 ${styles.dugme2} ${styles.linija_ispod_dugmeta}`}
                            onClick={() => setEditMode(true)}
                        >
                            Ažuriraj Predmet
                        </button>
                        <button 
                            className={`btn btn-sm my-2 text-white text-center rounded py-2 px-2 ${styles.dugme3} ${styles.linija_ispod_dugmeta}`}
                            onClick={handleDelete}>
                            Obriši Predmet
                        </button>
                    </div>
                    ) : (
                    <>
                    <div className={`mb-3`}>
                        <label className={`form-label text-steel-blue`}>Ime:</label>
                        <input
                        type="text"
                        className={`form-control`}
                        value={updatedName}
                        onChange={(e) => setUpdatedName(e.target.value)}
                        />
                    </div>
                    <div className={`mb-3`}>
                        <label className={`form-label text-steel-blue`}>Opis:</label>
                        <textarea
                        className={`form-control`}
                        value={updatedDescription}
                        onChange={(e) => setUpdatedDescription(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                      <label className={`form-label text-steel-blue`}>Kategorija:</label>
                      <select
                        className={`form-select ${styles.fields} mb-3`}
                        value={updatedCategory}
                        onChange={handleCategoryChange}
                        required
                      >
                        {Object.values(ItemCategory).map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={`mb-3`}>
                        <label className={`form-label text-steel-blue`}>Slike:</label>
                        <input
                        type="file"
                        className={`form-control`}
                        onChange={handlePicturesChange}
                        multiple
                        />
                    </div>
                    <button
                        className={`btn btn-sm my-2 text-white text-center rounded py-2 px-2 ${styles.dugme3} ${styles.linija_ispod_dugmeta}`}
                        onClick={handleUpdate}
                    >
                        Sačuvaj
                    </button>
                    <button
                        className={`btn btn-sm mx-1 my-2 text-white text-center rounded py-2 px-2 ${styles.dugme4} ${styles.linija_ispod_dugmeta}`}
                        onClick={() => setEditMode(false)}
                    >
                        Otkaži
                    </button>
                    </>
                )}
                </div>
            </div>
            
        </>) 
        : 
        (<p className={`text-center text-muted`}>Loading...</p>)}
    </div>
  );
};

export default DisplayItem;
