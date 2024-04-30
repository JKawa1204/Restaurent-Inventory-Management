import { useState, useEffect } from 'react';
import axios from 'axios';
import { Inappbar } from '../components/Inappbar';

export const Saleorder = () => {
  const [saleOrders, setSaleOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    OrderDate: '',
    TotalAmount: ''
  });
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchSaleOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/Saleorder/');
        setSaleOrders(response.data);
      } catch (error) {
        console.error('Error fetching sale orders:', error);
      }
    };

    fetchSaleOrders();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/Saleorder/search?term=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching sale orders:', error);
    }
  };

  const handleEdit = async (order) => {
    setNewOrder({
      OrderID: order.OrderID,
      OrderDate: order.OrderDate,
      TotalAmount: order.TotalAmount
    });
    setIsAdding(true);
  };

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/Saleorder/delete/${orderId}`);
      const updatedSaleOrders = saleOrders.filter(order => order.OrderID !== orderId);
      setSaleOrders(updatedSaleOrders);
    } catch (error) {
      console.error('Error deleting sale order:', error);
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (newOrder.OrderID) {
        await axios.put(`http://localhost:3000/api/v1/Saleorder/update/${newOrder.OrderID}`, newOrder);
      } else {
        await axios.post('http://localhost:3000/api/v1/Saleorder/add', newOrder);
      }
      const updatedSaleOrders = await axios.get('http://localhost:3000/api/v1/Saleorder/');
      setSaleOrders(updatedSaleOrders.data);
      setNewOrder({
        OrderDate: '',
        TotalAmount: ''
      });
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving sale order:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const handleAddNew = () => {
    setNewOrder({
      OrderDate: '',
      TotalAmount: ''
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
            placeholder="Search sale orders..."
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
          {searchResults.map((order) => (
            <div key={order.OrderID}>{order.OrderDate}</div>
          ))}
        </div>
      </div>
      <div className="bg-gray-400">
        {isAdding ? (
          <div className="flex flex-col items-center mt-10">
            <input
              type="text"
              name="OrderDate"
              value={newOrder.OrderDate}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Order Date"
            />
            <input
              type="text"
              name="TotalAmount"
              value={newOrder.TotalAmount}
              onChange={handleChange}
              className="w-full max-w-sm p-2 mb-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Total Amount"
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
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Order Date
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Total Amount
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {saleOrders.map((order) => (
                  <tr
                    key={order.OrderID}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-4">{order.OrderID}</td>
                    <td className="px-6 py-4">{order.OrderDate}</td>
                    <td className="px-6 py-4">{order.TotalAmount}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEdit(order)}
                        className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(order.OrderID)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              onClick={handleAddNew}
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
            >
              Add New
            </button>
          </div>
        )}
      </div>
    </>
  );
};
