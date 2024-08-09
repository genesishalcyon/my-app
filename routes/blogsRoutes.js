const express = require("express");
const router = express.Router();

const mysql = require("../config/db");

const {
  createblogs,
  displayBlogs,
  userBlogs,
  updateBlog,
  deleteBlog,
} = require("../controller/blogsController");

router.post("/blogs", createblogs);
router.get("/blogs", displayBlogs);
router.get("/user-blogs", userBlogs);
router.put("/user-blogs", updateBlog);
// router.delete("/user-blogs", deleteBlog);
router.delete("/user-blogs/:id", deleteBlog);

module.exports = router;
