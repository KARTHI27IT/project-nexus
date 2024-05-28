// use mysql for database and create users table with attibutes id(int auto_increment primary key) , name(varchar) ,email (varchar), password (varchar)
//alter the env file with respect your mysql server
// In vs code install express , hbs , mysql , dotenv , body-parser , cookie-parser , nodemon , bcryptjs , jsonwebtoken 
const express = require("express");
const hbs = require("hbs");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser"); // Corrected require statement
const app = express();

dotenv.config({
    path: "./.env", 
});
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("success");
    }
});

app.use(cookieParser()); // Corrected middleware usage
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const partialpath = path.join(__dirname,"./views/partials");
hbs.registerPartials(partialpath);

const location = path.join(__dirname, "./public");
app.use(express.static(location));
app.set("view engine", "hbs");

app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.listen(5000, () => {
    console.log("success");
});
