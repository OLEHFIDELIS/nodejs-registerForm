const express = require("express");
const cors    = require("cors");
const validator = require("email-validator");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:["http://127.0.0.1:5500/frontend/index.html"]
}))


app.post("/", (req,res) => {
 const validmail =   validator.validate(req.body.email);
 const validpass = validatePassword(req.body.password)
    if (validmail == true && validpass == true) {
        console.log("correct")
    } else  {
        console.log("error")
    };

   console.log(req.body)
   res.redirect("http://127.0.0.1:5500/frontend/index.html")
});


function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

app.listen("4000", () => {
    console.log("YelpCamp Server Just Started");
});