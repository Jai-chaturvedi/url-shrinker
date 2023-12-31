const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const PORT = process.env.PORT || 5000;

const connectDB = async()=>{
    try{
   const result = await mongoose.connect('mongodb+srv://jaichaturvedi1861:jai2002@cluster0.7fkgj8h.mongodb.net/urlShrinkerDB?retryWrites=true&w=majority',{
    useNewUrlParser : true,
    useUnifiedTopology : true
   });
    }catch(err) {
        console.log(' error in database connection occured');
        console.log(err);
    }
};
connectDB();
app.use(express.urlencoded({extended : false}));
app.set('view engine', 'ejs');
app.get('/',async (req,res)=>{
  const shortUrls =  await  ShortUrl.find();
    res.render('index',{shortUrls: shortUrls});

})


app.post('/shortUrls',async (req,res)=>{
    await  ShortUrl.create({full : req.body.fullUrl});
    res.redirect('/');
});

app.get('/:shortUrl',async (req,res)=>{
    const shortUrl = await ShortUrl.findOne({short : req.params.shortUrl});
    if(shortUrl==null) return res.sendStatus(404);
     shortUrl.clicks++;
     shortUrl.save();
     res.redirect(shortUrl.full);
})
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`);
});