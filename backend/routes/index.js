const express = require('express');
const inventoryroute = require("./inventory");
const customerroute = require('./customer');
const Purchaseorderroute = require('./Purchaseorder')
const Restaurantroute = require('./Restaurant')
const Saleorder = require('./Saleorder')
const Supplierroute = require('./supplier')
const userroute = require('./user')

const router = express.Router();


router.use('/inventory',inventoryroute);
router.use('/customer',customerroute);
router.use('/Purchaseorder',Purchaseorderroute);
router.use('/Restaurant',Restaurantroute);
router.use('/Saleorder',Saleorder);
router.use('/supplier',Supplierroute);
router.use('/user',userroute)



module.exports = router;