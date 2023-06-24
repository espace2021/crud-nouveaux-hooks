import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';

const CrudCateg = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputImage, setInputImage] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const inputRef = useRef(null);

  const URL = "https://backend-ecommerce-2023.vercel.app/api/categories"
  
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(URL); 
     setData(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

 
  const handleAdd = useCallback(() => {
    if (inputValue.trim() === '') return;
        const objectCateg={
            nomcategorie: inputValue,
            imagecategorie: inputImage
        }
     //faire le add dans la BD
 axios.post(URL,objectCateg)  
 .then(res => {  
   const response = res.data;  
   //MAJ de la liste affichéé
   setData((prevData) => [...prevData, response]);
   setInputValue('');
   setInputImage('')
   inputRef.current.focus();
 })    
  
  }, [inputValue]);

  const handleEdit = useCallback((index) => {
    setEditIndex(index);
    setInputValue(data[index].nomcategorie);
    setInputImage(data[index].imagecategorie);
    inputRef.current.focus();
  }, [data]);

  const handleUpdate = useCallback(() => {
    if (inputValue.trim() === '') return;

     setData((prevData) => {
      const newData = [...prevData];

      //connaitre l'id relatif à l'index de la ligne choisie
    var valueAtIndex = newData.at(editIndex); console.log(valueAtIndex._id)

    const objectCateg={
        _id:valueAtIndex._id,
        nomcategorie: inputValue,
        imagecategorie: inputImage
    }

    //update dans la BD
    axios.put(URL + '/' + valueAtIndex._id, objectCateg)
    .then(res => {  
      console.log(res.data);  
    }) 

      newData[editIndex] = objectCateg;
      return newData;
    });

    setEditIndex(null);
    setInputValue('');
    inputRef.current.focus();

    
  }, [editIndex, inputValue]);

  const handleDelete = useCallback((index) => {
    setData((prevData) => {
      const newData = [...prevData];
     
      //connaitre l'id relatif à l'index de la ligne choisie
      var valueAtIndex = newData.at(index); console.log(valueAtIndex._id)

      //faire le delete dans la BD
      axios.delete(`${URL}/${valueAtIndex._id}`)  
      .then(res => {  
        console.log(res.data);  
      })  

      //MAJ liste affichée
      newData.splice(index, 1);
      return newData;
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditIndex(null);
    setInputValue('');
    setInputImage('');
    inputRef.current.focus();
  }, []);

  const renderedItems = useMemo(() => {
    return data.map((item, index) => (
      <li key={index}>
        <img src={item.imagecategorie} width="50" height = "50" alt="image" />
        {item.nomcategorie}
        <button onClick={() => handleEdit(index)}>Edit</button>
        <button onClick={() => handleDelete(index)}>Delete</button>
      </li>
    ));
  }, [data, handleEdit, handleDelete]);

  return (
    <div>
      <h1>CRUD Catégories</h1>
      <input
        type="text"
        value={inputValue}
        onChange={(event)=> setInputValue(event.target.value)}
        ref={inputRef}
      />
      <input
        type="text"
        value={inputImage}
        onChange={(event)=> setInputImage(event.target.value)}
        ref={inputRef}
      />
      {editIndex !== null ? (
        <>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </>
      ) : (
        <button onClick={handleAdd}>Add</button>
      )}
      <ul>{renderedItems}</ul>
    </div>
  );
};

export default CrudCateg;
