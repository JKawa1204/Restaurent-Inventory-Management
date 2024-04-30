import { useState, useEffect } from 'react';
import axios from 'axios';
import { Inappbar } from '../components/Inappbar';

// Assuming you have stored the token in localStorage
const token = localStorage.getItem('token');

// Set the Authorization header for all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    ItemID: null,
    name: '',
    description: '',
    unitPrice: '',
    quantityAvailable: ''
  });

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/inventory/');
        setInventory(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const handleEdit = (itemId) => {
    const itemToEdit = inventory.find(item => item.ItemID === itemId);
    setNewItem({
      ItemID: itemToEdit.ItemID,
      name: itemToEdit.Name,
      description: itemToEdit.Description,
      unitPrice: itemToEdit.UnitPrice,
      quantityAvailable: itemToEdit.QuantityAvailable
    });
    setIsAdding(true);
  };

  const handleDelete = async (itemId) => {
    try {
      console.log('Deleting item with ID:', itemId);
      await axios.delete(`http://localhost:3000/api/v1/inventory/delete/${itemId}`);
      const updatedInventory = inventory.filter(item => item.ItemID !== itemId);
      setInventory(updatedInventory);
    } catch (error) {
      console.error('Error deleting inventory item:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (newItem.ItemID) {
        // Update existing item
        await axios.put(`http://localhost:3000/api/v1/inventory/update/${newItem.ItemID}`, newItem);
      } else {
        // Add new item
        await axios.post('http://localhost:3000/api/v1/inventory/add', newItem);
      }
      const updatedInventory = await axios.get('http://localhost:3000/api/v1/inventory/');
      setInventory(updatedInventory.data);
      setNewItem({ ItemID: null, name: '', description: '', unitPrice: '', quantityAvailable: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleAddNew = () => {
    setNewItem({ ItemID: null, name: '', description: '', unitPrice: '', quantityAvailable: '' });
    setIsAdding(true);
  };


  return (
    <>
      <Inappbar buttonText="Back" />
      <div className="max-w-md mx-auto">
        <div className="relative flex items-center">
          {/* Search bar */}
          <input
            type="text"
            placeholder="Search items..."
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button
            onClick={() => {}}
            className="absolute right-0 top-0 mt-3 mr-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div>
          {/* Display search results */}
          {inventory.map(item => (
            <div key={item.ItemID}>{item.name}</div>
          ))}
        </div>
      </div>
      <div className='bg-gray-400'>
        {isAdding ? (
          <div className="flex flex-col items-center mt-10">
            {/* Form for adding/editing items */}
            <input
              type="text"
              name="name"
              value={newItem.name}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Name"
            />
            <input
              type="text"
              name="description"
              value={newItem.description}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Description"
            />
            <input
              type="text"
              name="unitPrice"
              value={newItem.unitPrice}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Unit Price"
            />
            <input
              type="text"
              name="quantityAvailable"
              value={newItem.quantityAvailable}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Quantity Available"
            />
            <button
              onClick={handleSubmitEdit}
              className="w-full max-w-sm p-2 mb-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Unit Price
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Quantity Available
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.ItemID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">{item.ItemID}</td>
                    <td className="px-6 py-4">{item.Name}</td>
                    <td className="px-6 py-4">{item.Description}</td>
                    <td className="px-6 py-4">{item.UnitPrice}</td>
                    <td className="px-6 py-4">{item.QuantityAvailable}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(item.ItemID)} className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item.ItemID)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={handleAddNew} className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">Add New</button>
          </div>
        )}
      </div>
    </>
  );
};
