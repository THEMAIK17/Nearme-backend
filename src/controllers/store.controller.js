import express from 'express';
import { pool } from '../server/connection_db.js';

const router = express.Router();


router.get('/',async (req,res)=>{
    try {
        const [rows]= await pool.query(`SELECT * FROM stores `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        })
    }
})

router.get('/:nit',async (req,res)=>{
    try{
        const {nit}= req.params
        const [rows]= await pool.query( `SELECT *FROM stores WHERE nit_store=? `,[nit]);
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
// Get total views of a store by its ID and increment the view count
router.get('/:id', async (req, res)=>{
    
    try {
        const {id} = req.params;

        await pool.query(`INSERT INTO store_viws(id_store) VALUES (?)`,[id]);

        const [result] = await pool.query(`SELECT COUNT(*) AS total_views FROM store_views WHERE id_store;`, [id]);
        const total_views = result[0].total_views;

        res.json({
            storeId:id,
            total_views
        })
    } catch (error) {
        res.status(500).json({
            status: 'error',
            endpoint: req.originalUrl,
            method: req.method,
            message: error.message
        });
        
        
    }

})

router.post('/',async (req,res)=>{
    try{
        const {nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body; 
        const query= `INSERT INTO stores(nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note) VALUES (?,?,?,?,?,?,?,?,?)`;
        const values = [nit_store,store_name.trim(),address,phone_number,email,id_store_type,opening_hours,closing_hours,note.trim()];
        const [result] = await pool.query(query,values);
        res.status(201).json({
            message: "store created",
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

router.put('/:nit', async (req,res)=>{
    try {
        const {nit}= req.params;
        const{nit_store: new_nit_store,store_name,address,phone_number,email,id_store_type,opening_hours,closing_hours,note}=req.body;
        const query= `UPDATE stores SET nit_store=?,store_name=?,address=?,phone_number=?,email=?,id_store_type=?,opening_hours=?,closing_hours=?,note=? WHERE nit_store=?`;
        const values=[new_nit_store,store_name.trim(),address,phone_number,email,id_store_type,opening_hours,closing_hours,note.trim(),nit];
        const [result]= await pool.query(query,values);  
        
        if (result.affectedRows != 0) {
            return res.json({ mensaje: "store updated" })
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



router.delete('/:nit',async (req,res)=>{
    try {
        const {nit}= req.params;
        const query= `DELETE FROM stores WHERE nit_store=?`
        
        const values=[
            nit
        ]
        const [result]= await pool.query(query,values);
        
        if(result.affectedRows!==0){
            return res.json({message: 'store deleted'})
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