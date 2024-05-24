const express = require("express");
const cors    = require("cors");
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:["http://127.0.0.1:5500/frontend/index.html"]
}))


app.post("/", (req,res) => {
    console.log(req.body)
    

})



app.listen("4000", () => {
    console.log("YelpCamp Server Just Started");
});