
import { Link } from "react-router-dom"
import { Appbar } from "../components/Appbar"
import { Card } from "../components/Card"


export const Dashboard = ()=>{
    return <>
     <Appbar />
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-10"> 
            <Link to='/restaurants'>
            <Card title="Restaurents" description="Lists of all the restaurents we have business with."  ></Card>
            </Link>

            <Link to ='/inventory'>
            <Card title="InventoryItem" description="Consists of list of items available including their price and quantity." ></Card>
            </Link>

            <Link to ='/supplier'>
            <Card title="Supplier" description="List of different suppliers and their contact information." ></Card>
            </Link>

            <Link to ='/saleorder'>
            <Card title="Sale Order" description="All the recent sales order made to various customers." ></Card>
            </Link>

            <Link to ='/purchaseorder'>
            <Card title="Purchase Order" description="All the recent purchases which have been made." ></Card>
            </Link>

            <Link to ='/customer'>
            <Card title="Customers" description="List of all the customers and their contact information. " ></Card>
            </Link>

    </div>  
    </> 
}