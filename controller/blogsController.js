const mysql = require("../config/db");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const displayBlogs = async (req, res) => {
  try {
    const results = await mysql.query({
      sql: "SELECT * FROM blogs",
    });

    // const blogs = results.map((blog) => ({
    //   userID: blog.userID,
    //   title: blog.title,
    //   description: blog.description,
    // }));

    const userIds = [...new Set(results.map((blog) => blog.userID))];

    const usersResults = await mysql.query(
      "SELECT id, name, username FROM users WHERE id IN (?)",
      [userIds]
    );

    const usersMap = new Map(usersResults.map((user) => [user.id, user]));

    const blogs = results.map((blog) => ({
      id: blog.id,
      userID: blog.userID,
      title: blog.title,
      description: blog.description,
      user: usersMap.get(blog.userID),
    }));

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

const createblogs = async (req, res) => {
  const { userID, title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required.",
    });
  }

  try {
    const results = await mysql.query({
      sql: "INSERT INTO blogs (userID, title, description) values (?,?,?)",
      values: [userID, title, description],
    });

    return res.status(200).json({
      message: "Blog added successfully!",
    });
  } catch (error) {
    console.error("Error adding blog:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while adding the blog" });
  }
};

const userBlogs = async (req, res) => {
  const { userID } = req.query;

  if (!userID) {
    return res.status(400).json({ message: "User ID is not available" });
  }

  try {
    const results = await mysql.query(
      "SELECT id, title, description FROM blogs WHERE userID = ?",
      [userID]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "No blog posts to show" });
    }

    const blogs = results.map((blog) => ({
      id: blog.id,
      title: blog.title,
      description: blog.description,
    }));

    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  const { title, description, id } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required" });
  }

  try {
    const results = await mysql.query(
      "UPDATE blogs SET title = ?, description = ? WHERE id = ?",
      [title, description, id]
    );

    if (results.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog updated successfully!" });
  } catch (error) {
    console.error("Error updating blog:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the blog" });
  }
};

const deleteBlog = async (req, res) => {
  // const { id } = req.body;
  const { id } = req.params;

  try {
    const results = await mysql.query("DELETE FROM blogs WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting the blog" });
  }
};

module.exports = {
  createblogs,
  displayBlogs,
  userBlogs,
  updateBlog,
  deleteBlog,
};
