import React, { useState } from 'react'
import { ItemCategory } from '../../Enums/ItemCategory';
import { createItemAPI } from '../../Services/ItemService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../Interfaces/Item/Item';
import styles from "./CreateItem.module.css";

type Props = {}

const CreateItem = (props: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<ItemCategory>(ItemCategory.Subject);
    const [pictures, setPictures] = useState<FileList | null>(null);

    const navigate = useNavigate();
  
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setName(e.target.value);
    };
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDescription(e.target.value);
    };
  
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCategory(e.target.value as ItemCategory);
    };
  
    const handlePicturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setPictures(e.target.files);
      }
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
  
      if (pictures) {
        Array.from(pictures).forEach((file) => {
          formData.append('pictures', file);
        });
      }
  
      try {
        const response = await createItemAPI(formData);
  
        console.log(response);
        if(response && response.status==200){
            toast.success("Uspešno je dodat nov predmet.");
            const item:Item = response.data;
            navigate(`../items/${item.id}`);
        }
      } catch (error: any) {
            console.error(error.response?.data || error.message);
      }
    };
  
    return (
      <div className={`container-fluid bg-pale-blue d-flex justify-content-center flex-grow-1`}>
       <div className={`col-xxl-7 col-xl-7 col-lg-6 col-md-10 col-sm-12 p-5 m-4 bg-light rounded d-flex flex-column`}>
        <div className={`m-4`}>
          <h4 className={`text-center text-coral`}>Kreiraj Novi Predmet</h4>
          <form onSubmit={handleSubmit} className={`mt-4`}>
            <div className={`form-floating mb-2 mt-2`}>
              <input
                type="text"
                className={`form-control ${styles.fields}`}
                value={name}
                placeholder="Unesite ime"
                onChange={handleNameChange}
                required
              />
              <label htmlFor="name" className={styles.input_placeholder}>
                   Unesite ime
              </label>
            </div>
            <div className={`form-floating mb-2 mt-2`}>
              <textarea
                className={`form-control ${styles.fields}`}
                rows={2}
                value={description}
                placeholder="Unesite opis"
                onChange={handleDescriptionChange}
                required
              />
              <label htmlFor="description" className={styles.input_placeholder}>
                   Unesite opis
              </label>
            </div>
            <div>
              <select
                className={`form-select ${styles.fields}`}
                value={category}
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
            <div>
              <label className={`text-metal mb-1 mt-3`}>Slike:</label>
              <input
                type="file"
                className={`form-control ${styles.fields}`}
                onChange={handlePicturesChange}
                multiple
                required
              />
            </div>
            <button type="submit" className={`mt-4 rounded-3 bg-blue p-3 border-0 text-light ${styles.dugme}`}>Pošaljite</button>
          </form>
        </div>
      </div>
      </div>
      );
}

export default CreateItem