import axios from 'axios';
import { useState, useEffect } from 'react';
import { Inappbar } from '../components/Inappbar';

const token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/customer/');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/customer/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching customers:', error);
    }
  };

  const handleEdit = async (customer) => {
    setNewCustomer({
      CustomerID: customer.CustomerID,
      name: customer.Name,
      address: customer.Address,
      phone: customer.Phone,
      email: customer.Email
    });
    setIsAdding(true);
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/customer/delete/${customerId}`);
      const updatedCustomers = customers.filter(c => c.CustomerID !== customerId);
      setCustomers(updatedCustomers);
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (newCustomer.CustomerID) {
        await axios.put(`http://localhost:3000/api/v1/customer/update/${newCustomer.CustomerID}`, newCustomer);
      } else {
        await axios.post('http://localhost:3000/api/v1/customer/add', newCustomer);
      }
      const updatedCustomers = await axios.get('http://localhost:3000/api/v1/customer/');
      setCustomers(updatedCustomers.data);
      setNewCustomer({
        name: '',
        address: '',
        phone: '',
        email: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer({ ...newCustomer, [name]: value });
  };

  const handleAddNew = () => {
    setNewCustomer({
      name: '',
      address: '',
      phone: '',
      email: ''
    });
    setIsAdding(true);
  };

  return (
    <>
      <Inappbar buttonText="Back" />
      <div className="max-w-md mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 mt-3 mr-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        <div>
          {searchResults.map((customer) => (
            <div key={customer.CustomerID}>{customer.name}</div>
          ))}
        </div>
      </div>
      <div className='bg-gray-400'>
        {isAdding ? (
          <div className="flex flex-col items-center mt-10">
            <input type="text" name="name" value={newCustomer.name} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Name" />
            <input type="text" name="address" value={newCustomer.address} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Address" />
            <input type="text" name="phone" value={newCustomer.phone} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Phone" />
            <input type="text" name="email" value={newCustomer.email} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email" />
            <button onClick={handleSubmitEdit} className="w-full max-w-sm p-2 mb-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">Save</button>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Customer ID
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
                {customers.map(customer => (
                  <tr key={customer.CustomerID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">{customer.CustomerID}</td>
                    <td className="px-6 py-4">{customer.Name}</td>
                    <td className="px-6 py-4">{customer.Address}</td>
                    <td className="px-6 py-4">{customer.Phone}</td>
                    <td className="px-6 py-4">{customer.Email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(customer)} className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(customer.CustomerID)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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
