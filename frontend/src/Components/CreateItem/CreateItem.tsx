import React, { useState } from 'react'
import { ItemCategory } from '../../Enums/ItemCategory';
import { createItemAPI } from '../../Services/ItemService';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../Interfaces/Item/Item';

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
  
    const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div>
          <h2>Kreiraj Novi Predmet</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Ime:</label>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
            <div>
              <label>Opis:</label>
              <input
                type="text"
                value={description}
                onChange={handleDescriptionChange}
                required
              />
            </div>
            <div>
              <label>Kategorija:</label>
              <select
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
              <label>Slike:</label>
              <input
                type="file"
                onChange={handlePicturesChange}
                multiple
                required
              />
            </div>
            <button type="submit">Pošaljite</button>
          </form>
        </div>
      );
}

export default CreateItem