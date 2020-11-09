const express=require('express');
const feedController=require('../controllers/feed');
const router=express.Router();

router.get('/bus',feedController.getbus);
router.post('/addbus',feedController.addbus);
router.delete('/delete',feedController.deletePost);
router.patch('/addseats', feedController.addseats);
router.patch('/addtrips', feedController.addtrips);
router.post('/displayingdetails',feedController.displayingdetails);
module.exports=router;