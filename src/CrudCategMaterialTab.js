import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
// npm i material-react-table
import { MaterialReactTable } from 'material-react-table';
//npm i @mui/material
import {
    Box,
    IconButton,
    Tooltip,
    Button
  } from '@mui/material';
// npm i @mui/icons-material
import { Delete, Edit } from '@mui/icons-material';

import CreateCategModal from './CreateCategModal'

const CrudCateg = () => {
  
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [data, setData] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputImage, setInputImage] = useState('');


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

 
  const handleAdd = useCallback((values) => { 
    if (values.nomcategorie.trim() === '') return;
        const objectCateg={
            nomcategorie: values.nomcategorie,
            imagecategorie: values.imagecategorie
        }
     //faire le add dans la BD
 axios.post(URL,objectCateg)  
 .then(res => {  
   const response = res.data;  
   //MAJ de la liste affichéé
   setData((prevData) => [response,...prevData]);
   setInputValue('');
   setInputImage('')
  
 })    
  
  }, [inputValue,inputImage]);

  const handleEdit = useCallback((index) => {
    setInputValue(data[index].nomcategorie);
    setInputImage(data[index].imagecategorie);
  
  }, [data]);

  const handleUpdate = useCallback(({ exitEditingMode, row, values }) => {
    console.log(values)
    if (values.nomcategorie.trim() === '') return;

     setData((prevData) => {
      const newData = [...prevData];

      //connaitre l'id relatif à l'index de la ligne choisie
    var valueAtIndex = newData.at(row.index); console.log(valueAtIndex._id)

    const objectCateg={
        _id:valueAtIndex._id,
        nomcategorie: values.nomcategorie,
        imagecategorie: values.imagecategorie
    }

    //update dans la BD
    axios.put(URL + '/' + valueAtIndex._id, objectCateg)
    .then(res => {  
      console.log(res.data);  
    }) 

      newData[row.index] = objectCateg;
      return newData;
    });

   
    setInputValue('');
    setInputImage('');
   

    exitEditingMode(); //required to exit editing mode and close modal
    
  }, [inputValue,inputImage]);

  const handleDelete = useCallback((index) => {
    if (
      !window.confirm("Are you sure you want to delete")
    ) {
      return;
    }

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

 
  const columns = useMemo(
    () => [
        {
        accessorKey: 'nomcategorie',
        header: 'Nom',
        size: 100,
        muiTableHeadCellProps: {
          align: 'center',
        },
        muiTableBodyCellProps: {
          align: 'center',
        },
      },
      {
        accessorKey: 'imagecategorie',
        header: 'Image',
        Cell: ({ cell }) => <img src={cell.getValue()} alt="" width="100" height="100" />,
      },
    ],
    [],
  );


  const renderedItems = useMemo(() => {
    return <MaterialReactTable columns={columns} data={data} 
    displayColumnDefOptions={{
        'mrt-row-actions': {
          muiTableHeadCellProps: {
            align: 'center',
          },
          size: 120,
        },
      }}
      enableColumnOrdering
      enableEditing
      onEditingRowSave={handleUpdate}
    renderRowActions={({ row, table }) => (
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          <Tooltip arrow placement="left" title="Edit">
            <IconButton onClick={() => { table.setEditingRow(row);handleEdit(row.index)}}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip arrow placement="right" title="Delete">
            <IconButton color="error" onClick={() => handleDelete(row.index)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      renderTopToolbarCustomActions={() => (
        <Button
          color="secondary"
          onClick={() => setCreateModalOpen(true)}
          variant="contained"
        >
          Créer une catégorie
        </Button>
      )}
    />
   
  }, [data, handleEdit, handleDelete,columns]);

  return (
    <div>
      <h1>CRUD Catégories</h1>
      <CreateCategModal
        columns={columns}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleAdd}
      />

     
      <ul>{renderedItems}</ul>
    </div>
  );
};

export default CrudCateg;
