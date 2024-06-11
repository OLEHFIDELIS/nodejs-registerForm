const express = require("express");
const cors    = require("cors");
const flash  = require("connect-flash")
const ejs  = require("ejs")
const fs = require("fs")
const validator = require("email-validator");
const { error } = require("console");
const app = express();



app.set("view engine", "ejs");
app.use(flash());
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

        if (validmail == true && validpass == true) {
            let arrayData = [];
    
            // Read the existing data from the file
            fs.readFile("./data.json", 'utf8', (err, data) => {
                if (err && err.code !== 'ENOENT') {
                    return res.status(500).json({ error: 'Failed to read data file' });
                }
                if (data) {
                    arrayData = JSON.parse(data); 
                }
    
                arrayData.push(newdata); 
    
                
                fs.writeFile("./data.json", JSON.stringify(arrayData, null, 2), 'utf8', (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to write data file' });
                    }
    
                    // res.json({ message: 'Data successfully saved' });
                });
            });
            req.flash('success', 'You have successfully submitted your details');
            res.redirect("/")
        } else {
            req.flash('error', 'Invalid email or password');
            res.redirect("back");
        }
    } catch (error) {
        req.flash('error', error.message);
        res.redirect("back");
    }
});

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

app.listen("4000", () => {
    console.log("YelpCamp Server Just Started");
});