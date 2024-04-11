const connection = require('./connection');
const express = require("express");
const port = 4500;
const app = express();
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

connection.connect(function(error){
    if(error) throw error;
    else{
        console.log("Server listening on port "+ port)
        console.log("Database connected successfully..");
    }
})

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html")
});

app.post("/login",encoder,function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from userlogin where username=? and userpassword=?",[username,password],function(err,results,fields){
        if(results.length >0){
            res.redirect('/welcome')
        }else{
            res.redirect("/login");
        }
        res.end();
    })
})
app.post("/login",encoder,function(req,res){
    var username = req.body.username;
    var password = req.body.password;

    connection.query("select * from userlogin where username=? and userpassword=?",[username,password],function(err,results,fields){
        if(results.length >0){
            res.redirect('/welcome')
        }else{
            res.redirect("/login");
        }
        res.end();
    })
});
app.post("/register", encoder, function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var checkUsernameQuery = "SELECT * FROM userlogin WHERE username = ?";
    connection.query(checkUsernameQuery, [username], function(err, results, fields) {
        if (err) {
            console.error("Error checking username:", err);
            res.status(500).send("Internal Server Error");
            return;
        }
        if (results.length > 0) {
            res.redirect('/register');
        } else {
            var insertUserQuery = "INSERT INTO userlogin (username, userpassword) VALUES (?, ?)";
            connection.query(insertUserQuery, [username, password], function(err, results, fields) {
                if (err) {
                    console.error("Error inserting user:", err);
                    res.status(500).send("Internal Server Error");
                    return;
                }
                res.redirect('/login');
            });
        }
    });
});
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/welcome.html")
})
app.get("/register",function(req,res){
    res.sendFile(__dirname+"/register.html");
})
app.listen(port);