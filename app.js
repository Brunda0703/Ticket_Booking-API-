const express=require('express');
const bodyParser=require('body-parser');
const mongoclient = require('./utils/database').mongoConnect;
const feedRoutes=require('./routes/feed');

const app=express();

app.use(bodyParser.json());
app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Contron-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Contron-Allow-Headers','Content-Type','Authorization');
    next();
});
app.use('/feed',feedRoutes);

mongoclient(() => app.listen(8080));



