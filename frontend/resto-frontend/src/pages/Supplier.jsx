import  { useState, useEffect } from 'react';
import axios from 'axios';
import {Inappbar} from '../components/Inappbar';


export const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/supplier/');
        setSuppliers(response.data);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/supplier/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching suppliers:', error);
    }
  };


  const handleEdit = async (supplier) => {
    setNewSupplier({
        SupplierID: supplier.SupplierID, 
      name: supplier.Name,
      contactPerson: supplier.ContactPerson,
      phone: supplier.Phone,
      email: supplier.Email
    });
    setIsAdding(true);
  };

  const handleDelete = async (supplierId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/supplier/delete/${supplierId}`);
      const updatedSuppliers = suppliers.filter(s => s.SupplierID !== supplierId);
      setSuppliers(updatedSuppliers);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (newSupplier.SupplierID) {
        // Update existing supplier
        await axios.put(`http://localhost:3000/api/v1/supplier/update/${newSupplier.SupplierID}`, newSupplier);
      } else {
        // Add new supplier
        await axios.post('http://localhost:3000/api/v1/supplier/add', newSupplier);
      }
      const updatedSuppliers = await axios.get('http://localhost:3000/api/v1/supplier/');
      setSuppliers(updatedSuppliers.data);
      setNewSupplier({
        name: '',
        contactPerson: '',
        phone: '',
        email: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier({ ...newSupplier, [name]: value });
  };

  const handleAddNew = () => {
    setNewSupplier({
      name: '',
      contactPerson: '',
      phone: '',
      email: ''
    });
    setIsAdding(true);
  };

  return (
    <>
       <Inappbar buttonText="Back" />
      <div className="max-w-md mx-auto">
        {/* Search bar with Tailwind styles */}
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search suppliers..."
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="absolute right-0 top-0 mt-3 mr-4 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
        {/* Display search results */}
        <div>
          {searchResults.map((supplier) => (
            <div key={supplier.id}>{supplier.name}</div>
          ))}
        </div>
      </div>
      <div className='bg-gray-400'>
        {isAdding ? (
          <div className="flex flex-col items-center mt-10">
            <input type="text" name="name" value={newSupplier.name} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Name" />
            <input type="text" name="contactPerson" value={newSupplier.contactPerson} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Contact Person" />
            <input type="text" name="phone" value={newSupplier.phone} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Phone" />
            <input type="text" name="email" value={newSupplier.email} onChange={handleChange} className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Email" />
            <button onClick={handleSubmitEdit} className="w-full max-w-sm p-2 mb-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600">Save</button>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-10">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Supplier ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Contact Person
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
                {suppliers.map(supplier => (
                  <tr key={supplier.SupplierID} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <td className="px-6 py-4">{supplier.SupplierID}</td>
                    <td className="px-6 py-4">{supplier.Name}</td>
                    <td className="px-6 py-4">{supplier.ContactPerson}</td>
                    <td className="px-6 py-4">{supplier.Phone}</td>
                    <td className="px-6 py-4">{supplier.Email}</td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleEdit(supplier)} className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(supplier.SupplierID)} className="font-medium text-red-600 dark:text-red-500 hover:underline">Delete</button>
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

