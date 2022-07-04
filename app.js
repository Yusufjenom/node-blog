const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
const port = 5000;

app.get('/', (req, res)=>{
    res.render('index')
})
app.get('/about', (req, res)=>{
    res.render('about')
})
app.get('/contact', (req, res)=>{
    res.render('contact')
})

app.listen(process.env.PORT || port, ()=>{
    console.log(`server is running at ${port}`);
})