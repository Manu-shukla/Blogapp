var express = require('express'),
    expressSanitizer = require('express-sanitizer'),
    methodOverride = require('method-override'),
    app= express(),
    bodyParser= require('body-parser'),
    mongoose= require('mongoose');
    //app config
mongoose.connect("mongodb://localhost/restful_blog_app", {useMongoClient: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
//Mongoose schema config
var blogSchema = mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blogs", blogSchema);

//Restful Routes
app.get("/", function(req, res){
    res.redirect("/blogs");
});

//index route
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("error");
        }
        else{
            res.render("index", {blogs: blogs});
        }
    });
   
});

//new route
app.get("/blogs/new", function(req, res){
    res.render("new");
});



//create route
app.post("/blogs", function(req, res){
    
    Blog.create(req.body.blog, function(err, newBlog){
   if(err){
       res.render("new");
   }     
   else{
       //then redirect to the index
       res.redirect("/blogs");
   }
    });
});

//show route
app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err, found){
      if(err)
      {
          res.redirect("/blogs");
      }
      else
      {
          res.render("show", {blog: found})
      }
   });
});

//edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, findBlog){
        if(err)
        {
            res.redirect("/blogs");
        }
        else
        {
            res.render("edit", {blog: findBlog});
        }
    });
});

//Update Route
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id", function(req, res){
   Blog.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/blogs");
         }
         else{
             res.redirect("/blogs");
         }
   });
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Connected");
});