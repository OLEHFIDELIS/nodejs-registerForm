const express = require("express");
const cors    = require("cors");
const fs = require("fs")
const validator = require("email-validator");
const app = express();

const url = "http://127.0.0.1:5500/frontend/index.html";

app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:["http://127.0.0.1:5500/frontend/index.html"]
}))


app.post("/", (req,res) => {
    const newdata = req.body
 const validmail =   validator.validate(req.body.email);
 const validpass = validatePassword(req.body.password)
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

                res.json({ message: 'Data successfully saved' });
            });
        });
        console.log("correct")
    } else  {
        console.log("error")
    };

   console.log(req.body)
   res.redirect(url)
});


function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

app.listen("4000", () => {
    console.log("YelpCamp Server Just Started");
});