const express = require('express');
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication');
var checkRole = require('../services/checkRole');


//--------------------------Add Category to database API-----------------------
router.post('/add',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let category = req.body;

    var query = "insert into category(name) values(?)";
    connection.query(query,[category.name],(err,results)=>{
        if(!err){
            return res.status(200).json({ "message":"category Added Successfully" });
        }
        else{
            return res.status(500).json(err);
        }
    })
})


//--------------------------Get All category API---------------------------------
router.get('/get',auth.authenticateToken,(req,res,next)=>{    //in this API we cannot check for Role because anyone can get the category
    var query = "select * from category order by name";
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results);
        }
        else{
            return res.status(500).json(err);
        }
    })
})


//----------------------Update category API------------------------------------
router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    var query = "update category set name=? where id=?";
    connection.query(query,[product.name,product.id],(err,results)=>{
        if(!err){
            //any row is not changed
            if(results.affectRows == 0){
                return res.status(404).json({"message":"Category id does not found"});
            }
            return res.status(200).json({"message":"Category Updated Successfully"});
        }
        else{
            return res.status(500).json(err);
        }
    })
})


module.exports = router;