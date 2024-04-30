import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Inappbar } from '../components/Inappbar';

// Assuming you have stored the token in localStorage
const token = localStorage.getItem('token');

// Set the Authorization header for all requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    RestaurantID: null,
    name: '',
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/Restaurant/');
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, []);

  const handleEdit = (restaurantId) => {
    const restaurantToEdit = restaurants.find(restaurant => restaurant.RestaurantID === restaurantId);
    setNewRestaurant({
      RestaurantID: restaurantToEdit.RestaurantID,
      name: restaurantToEdit.Name,
      address: restaurantToEdit.Address,
      phone: restaurantToEdit.Phone,
      email: restaurantToEdit.Email
    });
    setIsAdding(true);
  };

  const handleDelete = async (restaurantId) => {
    try {
      console.log('Deleting restaurant with ID:', restaurantId);
      await axios.delete(`http://localhost:3000/api/v1/Restaurant/delete/${restaurantId}`);
      const updatedRestaurants = restaurants.filter(restaurant => restaurant.RestaurantID !== restaurantId);
      setRestaurants(updatedRestaurants);
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (newRestaurant.RestaurantID) {
        // Update existing restaurant
        await axios.put(`http://localhost:3000/api/v1/Restaurant/update/${newRestaurant.RestaurantID}`, newRestaurant);
      } else {
        // Add new restaurant
        await axios.post('http://localhost:3000/api/v1/Restaurant/add', newRestaurant);
      }
      const updatedRestaurants = await axios.get('http://localhost:3000/api/v1/Restaurant/');
      setRestaurants(updatedRestaurants.data);
      setNewRestaurant({ RestaurantID: null, name: '', address: '', phone: '', email: '' });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving restaurant:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewRestaurant({ ...newRestaurant, [name]: value });
  };

  const handleAddNew = () => {
    setNewRestaurant({ RestaurantID: null, name: '', address: '', phone: '', email: '' });
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
            placeholder="Search restaurants..."
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
          {restaurants.map(restaurant => (
            <div key={restaurant.RestaurantID}>{restaurant.name}</div>
          ))}
        </div>
      </div>
      <div className='bg-gray-400'>
        {isAdding ? (
          <div className="flex flex-col items-center mt-10">
            {/* Form for adding/editing restaurants */}
            <input
              type="text"
              name="name"
              value={newRestaurant.name}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Name"
            />
            <input
              type="text"
              name="address"
              value={newRestaurant.address}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Address"
            />
            <input
              type="text"
              name="phone"
              value={newRestaurant.phone}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Phone"
            />
            <input
              type="text"
              name="email"
              value={newRestaurant.email}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Email"
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
                    Restaurant ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Address
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Phone
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(restaurant => (
                  <tr key={restaurant.RestaurantID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">{restaurant.RestaurantID}</td>
                    <td className="px-6 py-4">{restaurant.name}</td>
                    <td className="px-6 py-4">{restaurant.address}</td>
                    <td className="px-6 py-4">{restaurant.phone}</td>
                    <td className="px-6 py-4">{restaurant.email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(restaurant.RestaurantID)} className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(restaurant.RestaurantID)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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
