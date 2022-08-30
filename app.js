const express = require('express');
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const app = express();

//connect to database(mongodb shell)
mongoose.connect('mongodb://localhost/blogs')
mongoose.connection
.once('open', ()=> console.log('connected to mongodb database'))
.on('error', (err)=> console.log(err))

// my middle-wear
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
const port = process.env.PORT || 5000;

//creating a SCHEMA
const Schema = mongoose.Schema
const blogSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
}, {timestamps: true})

// collection
const Blog = mongoose.model('blog', blogSchema)


//basic get routes
app.get('/', (req, res)=>{
    const blog = new Blog({
         title: 'yusuf blog',
         body: 'how are grew my startup from zero to 200 million dollars'
            })
    res.redirect('/blogs')
})

app.get('/about', (req, res)=>{
    res.render('about', {title: 'know more about us'})
})

app.get('/contact', (req, res)=>{
    res.render('contact', {title: 'contact us'})
})

// blog routes
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1}) //arrangement of blog in desending order
     .then((result)=>{
        res.render('index', {title: 'Our blogs', blogs: result})
     })
     .catch((err)=>{
        console.log(err)
     })
})

app.get('/compose', (req, res)=>{
    res.render('compose', {title: 'upload new blog'})
})


app.post('/blogs', (req, res)=>{
 const blog = new Blog(req.body)
 blog.save()
  .then((result)=>{
    res.redirect('/blogs')
  })
  .catch((err)=>{
    console.log(err)
  })
})

app.get('/blogs/:id', (req, res)=>{
    const id = req.params.id
    Blog.findById(id)
     .then((result)=>{
        res.render('details', { blog: result, title: 'blog details'} )
      })
       .catch((err)=>{
         console.log(err)
       })
 })

 // delete route
app.delete('blogs/:id', (req, res)=>{
    const id = req.params.id
    Blog.findByIdAndDelete(id, (err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect('/blogs')
        }
    })
    
    //  .then((result)=>{
    //     res.json({redirect: '/blogs'})
    //     //res.redirect('/blogs')
    // })
    //  .catch((err)=>{
    //     console.log(err)
    // })
})


app.listen(process.env.PORT || port, ()=>{
    console.log(`server is running at ${port}`);
})