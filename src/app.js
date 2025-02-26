 const express = require("express");


 const app = express();

 app.get("/user", (req, res)=> {
    res.send({firstName: "Suraj",lastName: "Verma"});
 })

 app.post("/user", (req, res)=> {
    console.log("User added");
    res.send("User added successfully");
 })

 app.delete("/user", (req, res) => {
    res.send("User deleted");
 })

 app.use((req, res)  => {
    res.send("Hello from the server")
 })

 app.listen(3000, () => {
    console.log("=========== Server started at 3000 ======")
 })