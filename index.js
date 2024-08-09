const express = require("express");

const usersRoutes = require("./routes/usersRoutes");

const blogsRoutes = require("./routes/blogsRoutes");

const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.options("*");
app.use(usersRoutes);
app.use(blogsRoutes);

app.listen(3000, () => {
  console.log("Listening http://localhost:3000");
});
