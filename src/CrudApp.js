import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

const CrudApp = () => {
  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch initial data from an API or other data source
    // For simplicity, we'll use a static array
    const initialData = ['Apple', 'Banana', 'Orange'];
    setData(initialData);
  }, []);

  const handleInputChange = useCallback((event) => {
    setInputValue(event.target.value);
  }, []);

  const handleAdd = useCallback(() => {
    if (inputValue.trim() === '') return;

    setData((prevData) => [...prevData, inputValue]);
    setInputValue('');
    inputRef.current.focus();
  }, [inputValue]);

  const handleEdit = useCallback((index) => {
    setEditIndex(index);
    setInputValue(data[index]);
    inputRef.current.focus();
  }, [data]);

  const handleUpdate = useCallback(() => {
    if (inputValue.trim() === '') return;

    setData((prevData) => {
      const newData = [...prevData];
      newData[editIndex] = inputValue;
      return newData;
    });

    setEditIndex(null);
    setInputValue('');
    inputRef.current.focus();
  }, [editIndex, inputValue]);

  const handleDelete = useCallback((index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditIndex(null);
    setInputValue('');
    inputRef.current.focus();
  }, []);

  const renderedItems = useMemo(() => {
    return data.map((item, index) => (
      <li key={index}>
        {item}
        <button onClick={() => handleEdit(index)}>Edit</button>
        <button onClick={() => handleDelete(index)}>Delete</button>
      </li>
    ));
  }, [data, handleEdit, handleDelete]);

  return (
    <div>
      <h1>CRUD App</h1>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
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

export default CrudApp;
