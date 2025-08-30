import express from 'express';
import { pool } from '../server/connection_db.js';

const router = express.Router();




router.get('/', async (req,res)=>{
    try {
        const [rows]= await pool.query(`SELECT * FROM products  ORDER BY id_product`);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})
router.get('/:id',async (req,res)=>{
    try{
        const {id}= req.params
        const [rows]= await pool.query( `SELECT *FROM products WHERE id_product=? ORDER BY id_product `,[id]);
        res.json(rows[0]);
    }catch(error){
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

router.post('/',async (req,res)=>{
    try{
        const {product_name,price,stock,category,id_store,product_description}=req.body; 
        const query= `INSERT INTO products(product_name,price,stock,category,id_store,product_description) VALUES (?,?,?,?,?,?)`;
        const values = [product_name.trim(),price,stock,category.trim(),id_store,product_description.trim()];
        const [result] = await pool.query(query,values);
        res.status(201).json({
            message: "product created",
            id_product: result.insertId,
        })
    }catch(error){
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
});

router.put('/:id', async (req,res)=>{
    try {
        const {id}= req.params;
        const{product_name,price,stock,category,id_store,product_description}=req.body;
        const query= `UPDATE products SET product_name=?, price=?, stock=?,category=?,id_store=?,product_description=? WHERE id_product=?`;
        const values=[product_name.trim(),price,stock,category.trim(),id_store,product_description.trim(),id];
        const [result]= await pool.query(query,values);  
        
        if (result.affectedRows != 0) {
            return res.json({ mensaje: "product updated" })
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        })
    }
});

router.delete('/:id',async (req,res)=>{
    try {
        const {id}= req.params;
        const query= `DELETE FROM products WHERE id_product=?`
        
        const values=[
            id
        ]
        const [result]= await pool.query(query,values);
        
        if(result.affectedRows!==0){
            return res.json({message: 'product deleted'})
        }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
    }
})

export default router;
