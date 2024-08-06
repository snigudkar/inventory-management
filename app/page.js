

// //code 3
// 'use client'
// import Image from 'next/image';
// import { useState, useEffect } from 'react';
// import { firestore } from '@/firebase';
// import { Box, Modal, Typography ,Stack, TextField, Button} from '@mui/material';
// import { query, collection, getDocs } from 'firebase/firestore';

// export default function Home() {
//   const [inventory, setInventory] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [itemName, setItemName] = useState('');

//   const updateInventory = async () => {
//     try {
//       const snapShot = query(collection(firestore, 'inventory'));
//       const docs = await getDocs(snapShot);
//       const inventoryList = [];
//       docs.forEach((doc) => {
//         inventoryList.push({
//           name: doc.id,
//           ...doc.data(),
//         });
//       });
//       setInventory(inventoryList);
      
//       const removeItem = async (item)=>{
//         const docRef = doc(collection(firestore, 'inventory'),item)
//         const docSnap = await getDoc(docRef)

//         if (docSnap.exists()){
//           const {quantity} = docSnap.data()
//           if (quantity===1){
//             await deleteDoc(docRef)
//           }
//           else{
//             await setDoc(docRef,{quantity:quantity-1})
//           }
//         }
//         await updateInventory()
//       }

//       //add item
//       const addItem = async (item)=>{
//         const docRef = doc(collection(firestore, 'inventory'),item)
//         const docSnap = await getDoc(docRef)

//         if (docSnap.exists()){
//           const {quantity} = docSnap.data()
//           await setDoc(docRef,{quantity:quantity+1})
          
//         }
//         else{
//           await setDoc(docRef,{quantity:1})
//         }
//         await updateInventory()
//       }

//     } catch (error) {
//       console.error('Error fetching inventory:', error);
//     }
//   };

//   useEffect(() => {
//     updateInventory();
//   }, []);

//   const handleOpen=() => setOpen(true)
//   const handleClose=() => setOpen(false)

//   return (
//     <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center" flexDirection="column" gap={2}>
      
//       <Modal open={open} onClose={handleClose}>
//         <Box position="absolute" top="50%" left="50%" sx={{transform: 'translate(-50%,-50%)' }}  width={400} bgcolor="white" border="2px solid #000" boxShadow={24} p={4} display="flex" flexDirection="column" gap={3}> 
//             <Typography variant="h6">Add Item</Typography>
//             <Stack width="100%" direction="row" spacing={2}>
//               <TextField variant="outlined" fullWidth value={itemName} onChange={(e)=>{
//                   setItemName(e.target.value)
//               }} />
                   
//               <Button vaiant="outlined" onClick={()=>{
//                 addItem(itemName)
//                 setItemName('')
//                 handleClose

//               }}>Add</Button>
//             </Stack>
//         </Box>
        
//       </Modal>
      
//       <Button 
//         variant="contained"
//         onclick={()=>{
//           handleOpen()
//         }}>Add New Item
//       </Button>

//       <Box border="1px solid #333">
//         <Box
//           width="600px"
//           height="50px"
//           bgcolor="#F3CFC6"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <Typography variant="h4" color="#333">Inventory Items</Typography>
//         </Box>
//       </Box>

      
//         <Stack width="600px" height="70px" spacing={2} overflow="auto">
//           {
//             inventory.map(({name ,quantity})=>(
//               <Box key={name} width="100%" minHeight="100px" display="flex" alignItems="center" justifyContent="space-between" bgcolor="#F0F0F0" padding={5} >
//                 <Typography variant="h6" color="#333" textAlign="center">{name.charAt(0).toUpperCase()+name.slice(1)}</Typography>
//                 <Typography variant="h6" color="#333" textAlign="center">{quantity}</Typography>
//               </Box>
              
//             ))}
          
//         </Stack>
        
//     </Box>
//   );
// }



'use client'
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Button, TextField, IconButton, Paper } from '@mui/material';
import { query, collection, getDocs, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    try {
      const snapShot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapShot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({
          name: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
      console.log(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const handleAddItem = () => {
    if (itemName.trim() !== '') {
      addItem(itemName);
      setItemName('');
    }
  };

  const incrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
      await updateInventory();
    }
  };

  const decrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity > 1) {
        await setDoc(docRef, { quantity: quantity - 1 });
      } else {
        await deleteDoc(docRef);
      }
      await updateInventory();
    }
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      minHeight="100vh"
      bgcolor="#f0f4f8"
      p={3}
    >
      <Typography variant="h2" gutterBottom sx={{ mt: 5, mb: 5, fontFamily:'Comic Sans MS' }}>
        Inventory Management
      </Typography>
      <Box display="flex" alignItems="center" mb={5} sx={{ width: '100%', maxWidth: '500px' }}>
        <TextField
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ flexGrow: 1, mr: 1 }}
        />
        <Button onClick={handleAddItem} variant="contained" color="primary">
          Add Item
        </Button>
      </Box>
      {
        inventory.map((item) => (
          <Paper
            key={item.name}
            elevation={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '500px',
              p: 2,
              mb: 3,
              bgcolor: '#fff',
            }}
          >
            <Box display="flex" flexDirection="column">
              <Typography variant="h6" sx={{ fontFamily: 'Roboto, sans-serif' }}>{item.name}</Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Roboto, sans-serif' }}>Quantity: {item.quantity}</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => incrementQuantity(item.name)} color="primary">
                <AddIcon />
              </IconButton>
              <IconButton onClick={() => decrementQuantity(item.name)} color="default">
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={() => deleteItem(item.name)} color="secondary">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))
      }
    </Box>
  );
}



