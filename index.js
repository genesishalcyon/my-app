const express = require("express");
const app = express();
const port = 3000;

const db = require("./config/db");

const booksRoutes = require("./routes/booksRoutes");

const cors = require("cors");

app.use(cors());

app.options("*", cors());

app.use(express.json());

app.use(booksRoutes);

app.get("/em", async (req, res) => {
  let results = await db.query("SELECT * FROM employees");

  return res.status(200).json(results);
});

const employees = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Genesis",
  },
  {
    id: 3,
    name: "Gerald",
  },
];

const books = [
  { id: 1, title: "Book 1" },
  { id: 2, title: "Book 2" },
  { id: 3, title: "Book 3" },
];

app.get(
  "/",
  (req, res, next) => {
    return res.json(employees);
  },
  (req, res, next) => {}
);

app.get("/test", (req, res, next) => {
  return res.json(employees);
});

app.get("/books", (req, res, next) => {
  return res.json(books);
});

app.get("/employees", (req, res, next) => {
  return res.json(employees);
});

app.get("/employees/:id", (req, res, next) => {
  const id = parseInt(req.params.id);

  // const employeeFound = employees.find((employee) => employee.id === id);

  const employeeFound = employees.find((employee) => {
    if (employee.id === id) {
      return employee;
    }
  });

  if (employeeFound) {
    return res.status(200).json({
      enter: id,
      message: "Employee found",
      employee: employeeFound,
    });
  } else
    return res.status(404).json({
      enter: id,
      essage: "Employee not found",
    });
});

app.delete("/employees/:id", (req, res, next) => {
  const id = parseInt(req.params.id);

  const indexFound = employees.findIndex((employee) => {
    if (employee.id === id) {
      return employee.id;
    }
  });

  if (indexFound !== -1) {
    employees.splice(indexFound, 1);
    return res.status(200).json({
      enter: id,
      message: "Employee deleted successfully!",
    });
  } else {
    return res.status(404).json({
      message: "Employee not found",
    });
  }
});

// app.put("/employees/:id", (req, res, next) => {
//   const id = parseInt(req.params.id)

//   const employeeFound
// })

// app.get("/books/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   console.log("id", id);

//   const bookFound = books.find((book) => {
//     if (book.id === id) {
//       console.log("book", book);
//       return book;
//     }
//   });

//   if (!bookFound) {
//     return res.status(404).json({
//       message: "Book not found.",
//     });
//   }

//   return res.status(200).json(bookFound);
// });

// app.delete("/books/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const bookFound = books.find((book) => {
//     if (book.id === id) {
//       console.log("book", book);
//       return book.id;
//     }
//   });

//   const foundIndex = books.findIndex((book) => book.id == id);

//   console.log(foundIndex);

//   if (!bookFound) {
//     return res.status(400).json({
//       message: "Book not found.",
//     });
//   }

//   books.splice(foundIndex, 1);
//   return res.status(200).json({
//     message: "Book delete successfully.",
//   });
// });

// app.put("/books/:id", (req, res) => {
//   const bookFound = books.find((book) => book.id === parseInt(req.params.id));
//   if (!bookFound) {
//     return res.status(400).json({
//       message: "Book not found.",
//     });
//   }

//   bookFound.title = req.body.title;

//   return res.status(200).json({
//     data: bookFound,
//     message: "Book updated successfully.",
//   });
// });

// app.post("/books", (req, res) => {
//   console.log(req.body);

//   const data = {
//     title: req.body.title,
//     id: books.length + 1,
//   };

//   const newBook = data;

//   books.push(newBook);

//   return res.status(200).json({
//     data: newBook,
//     message: "Hello World",
//   });
// });

app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});

// book name, author, date released
