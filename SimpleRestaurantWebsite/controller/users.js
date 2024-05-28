const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const {promisify}=require("util");
const bcrypt = require("bcryptjs");


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});


exports.register = (req,res)=>{
const { name, email, password, confirm_password} = req.body;
db.query("select email from users where email=?",
    [email],
    async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {
            return res.render("signup", { msg: "email already taken", msg_type: "error" });
        } else if (password !== confirm_password) {
            return res.render("signup", { msg: "enter correct password", msg_type: "error" });
        }else if(password.length<4){
            return res.render("signup", { msg: "password greater than 4 characters", msg_type: "error" });
        }
        let hashedpassword = await bcrypt.hash(password, 8);

        db.query("insert into users set ?", { name: name, email: email, password: hashedpassword },
            (err, result) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log(result);
                    console.log("Name : "+name);
                    console.log("email : "+email);
                    return res.redirect("/login");    
                }
            });
    });
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).render("login", {
                msg: "Enter email and password",
                msg_type: "error"
            });
        }

        db.query("SELECT * FROM users WHERE email = ?", [email], async (error, result) => {
            if (error) {
                console.error("Database Error: ", error);
                return res.status(500).render("login", {
                    msg: "Internal server error",
                    msg_type: "error"
                });
            }

            if (result.length <= 0 || !(await bcrypt.compare(password, result[0].password))) {
                return res.status(401).render("login", {
                    msg: "Incorrect email or password",
                    msg_type: "error"
                });
            }

            const id = result[0].id;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES
            });
            console.log("Token: ", token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true,
            };
            res.cookie("karthi", token, cookieOptions);
            res.status(200).redirect("/");
        });
    } catch (error) {
        console.error("Login Error: ", error);
        res.status(500).render("login", {
            msg: "Internal server error",
            msg_type: "error"
        });
    }
};


exports.isLogged = async (req, res, next) => {
    if (req.cookies.karthi) {
        try {
            const token = req.cookies.karthi;
            if (!token || token.split('.').length !== 3) {
                throw new Error('JWT malformed');
            }

            const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

            db.query("SELECT * FROM users WHERE id = ?", [decode.id], (err, result) => {
                if (err) {
                    console.error("Database Error: ", err);
                    return next();
                }
                if (!result || result.length === 0) {
                    return next();
                }
                req.user = result[0];
                return next();
            });
        } catch (error) {
            console.error("JWT Verification Error: ", error);
            return next();
        }
    } else {
        next();
    }
};

exports.logout=async(req,res,next)=>{
    res.cookie("karthi","logout",{
        expires:new Date(Date.now()+2*1000),
        httpOnly:true,
    });
    res.status(200).redirect("/");
}