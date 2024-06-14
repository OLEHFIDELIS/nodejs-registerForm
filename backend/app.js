const express = require("express");
const cors    = require("cors");
const flash  = require("connect-flash");
const ejs  = require("ejs");
const fs = require("fs").promises;
const validator = require("email-validator");
const { error } = require("console");
const path = require('path');
const app = express();


// Set the views directory
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(flash());

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "I am Oleh",
    resave:false,
    saveUninitialized :false,
    
}));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:["http://127.0.0.1:5500/frontend/index.html"]
}))
app.use( async (req, res,next)=> {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
}); 

app.get("/", (req,res) => {
   res.render("index")
})

app.post("/", async (req, res) => {
    try {
        const newdata = req.body;
        const validmail = validator.validate(req.body.email);
        const validpass = validatePassword(req.body.password);

        if (validmail && validpass) {
            let arrayData = [];

            try {
                const data = await fs.readFile("./data.json", 'utf8');
                arrayData = JSON.parse(data);
            } catch (err) {
                if (err.code !== 'ENOENT') {
                    return res.status(500).json({ error: 'Failed to read data file' });
                }
            }

            const emailExists = arrayData.some(user => user.email === req.body.email.trim());
            if (emailExists) {
                req.flash('error', 'Email already exist');
                return res.redirect("/")
            }

            arrayData.push(newdata);

            try {
                await fs.writeFile("./data.json", JSON.stringify(arrayData, null, 2), 'utf8');
                req.flash('success', 'You have successfully submitted your details');
                res.redirect("/");
            } catch (err) {
                req.flash('error', 'Failed to write data file');
                res.redirect("back");
            }
        } else {
            req.flash('error', 'Invalid email or password');
            res.redirect("back");
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect("/");
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    req.flash('error', err.message);
    res.redirect("/")
  
});

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

app.listen("4000", () => {
    console.log("YelpCamp Server Just Started");
});