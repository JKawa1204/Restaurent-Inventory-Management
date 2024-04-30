import { BrowserRouter,Routes , Route } from 'react-router-dom';
import { Signup} from './pages/Signup';
import {Signin} from './pages/Signin';
import { Dashboard} from './pages/Dashboard';
import {Customer} from './pages/Customer';
import {Inventory} from './pages/Inventory';
import {Purchaseorder} from './pages/Purchaseorder';
import {Restaurants} from './pages/Restaurants';
import {Saleorder} from './pages/Saleorder'
import {Supplier} from './pages/Supplier'
function App() {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/purchaseorder" element ={<Purchaseorder />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/saleorder" element={<Saleorder />} />
          <Route path="/supplier" element={<Supplier />} />
          
        </Routes>
    </BrowserRouter>
  )
}

export default App

