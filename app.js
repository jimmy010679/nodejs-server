// ----------------------------------------------------------------------------------------------
// 載入Express 套件
const express = require("express");

// 載入 CORS
let cors = require("cors");
const corsOptions = {
  origin: [
    "http://www.example.com",
    "http://localhost:3000",
    "http://localhost",
  ],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 建立 express application 物件
let app = express();

// CORS
app.use(cors());

// 資料庫
let db = require("./database.js");

/* ----------------------------------------------------------------------------------------------
   設定靜態頁面 */
app.use(express.static(__dirname + "/dist"));

// 首頁
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

/* ----------------------------------------------------------------------------------------------
   API
*/
// Book
app.get("/api/books/all", function (req, res, next) {
  let sql = "Select books.sid From books limit 100";
  let params = [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// commic - page
app.get("/api/books/page/:page", function (req, res) {
  let sql = "Select * From books ORDER BY start DESC limit 20 offset ? ";
  let offset = 20 * req.params.page - 20;

  let query = [offset];
  console.log(query);

  db.all(sql, query, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// commic category type - page
app.get("/api/books/:category_id/page/:page", function (req, res) {
  let sql =
    "Select * From books Where category_id = ? ORDER BY start DESC limit 20 offset ? ";
  let query = [req.params.category_id, req.params.page];
  console.log(query);

  db.all(sql, query, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

app.get("/api/book/:sid", (req, res, next) => {
  let sql = "Select * From books where sid = ?";
  let params = [req.params.sid];

  db.get(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: row,
    });
  });
});

/* ----------------------------------------------------------------------------------------------
   PORT Listen
*/
let port = process.env.PORT || 8080;

let server = app.listen(port, function () {
  console.log("Start");
});

/* https://stackoverflow.com/questions/39677759/express-js-socket-io-socket-io-js-404 */
var io = require("socket.io")(server);
