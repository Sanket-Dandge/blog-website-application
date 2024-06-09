import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
var heading = "";
var author = "";
var content = "";
var summary = "";
var made_time = new Date();

var blogList = [];
let blogID = 0;

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {blogList: blogList});
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/new", (req, res) => {
  res.render("newpost.ejs");
});

app.get("/faqs", (req, res) => {
  res.render("faqs.ejs");
});

app.post("/submit", (req, res) => {
  const formType = req.body["formType"];
  console.log(formType);
  switch (formType) {
    case "form1":
      res.send("<script>alert('Form Successfully Submitted!'); window.location.href = '/';</script>");
      break;

    case "form2":
      heading = req.body["blogHeading"];
      author = req.body["author"];
      content = req.body["content"];
      summary = content.length > 300 ? content.substring(0, 100) + '...' : content;
      blogList.push({id: blogID++, heading, made_time, author, content, summary});
      console.log(blogList);
      res.redirect("/");
    default:
      break;
  }
});

app.get("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogToEdit = blogList.find((i) => i.id === parseInt(blogId));
  res.render("edit.ejs", {blogToEdit: blogToEdit});
});

app.post("/edit/:id", (req, res) => {
  const blogId = req.params.id;
  const blogIndex = blogList.findIndex((i) => i.id === parseInt(blogId));
  const newContent = req.body["content"];
  if (blogIndex !== -1) {
    blogList[blogIndex] = {
      id: parseInt(blogId),
      made_time: new Date(),
      heading: req.body["blogHeading"],
      author: req.body["author"],
      content: newContent,
      summary: newContent.length > 300 ? newContent.substring(0, 100) + '...' : newContent,
    };
    console.log(blogList);
    res.redirect("/");
  } else {
    res.status(404).send("Blog not found");
  }
});

app.post("/delete/:id", (req, res) => {
  const blogId = req.params.id;
  blogList = blogList.filter(i => i.id !== parseInt(blogId));
  res.redirect("/");
});

app.get('/blog/:id', (req, res) => {
  const blogId = req.params.id;
  var blogToRead = blogList.find((blog) => blog.id === parseInt(blogId));
  if (blogToRead) {
    res.render("blog.ejs", {blogToRead: blogToRead});
  } else {
    res.status(404).send("Blog Not Found");
  }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
