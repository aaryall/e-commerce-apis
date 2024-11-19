//1. Import express
import express from 'express';
import { ProductController } from './product.controller.js';
import {upload} from '../../middlewares/file-upload.middleware.js';
const router = express.Router();




const productController =  new ProductController()

router.post('/rating',(req,res)=>{
    productController.rateProduct(req,res);
});

router.get('/filter',(req,res)=>{
    productController.getFilterItem(req,res);
});

router.get('/averagePrice',(req,res, next)=>{
    productController.averagePrice(req,res);
});

router.get('/:id',(req,res)=>{
    productController.getOneProduct(req,res);
});

router.get('/',(req,res)=>{
    productController.getAllProduct(req,res);
});

router.post('/',upload.single('imageUrl'),(req,res)=>{
    productController.addProduct(req,res);
});







export default router;