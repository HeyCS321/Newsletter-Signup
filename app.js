// jshint esversion: 6

const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.use(express.static("Public"));

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    // res.send("Hello there");
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const FName = req.body.fname;
    const LName = req.body.lname;
    const Email = req.body.email;
    
    const data = {
        members: [
            {
                email_address: Email, 
                status: "subscribed",
                merge_fields : {
                    FNAME: FName,
                    LNAME: LName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data); 

    const url = "https://us11.api.mailchimp.com/3.0/lists/200a344573";

    const options = {
        method: "POST",
        auth: "sekhar:85a66464deee073afa2a32f44609df2a-us11"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html")
        } else {
            res.sendFile(__dirname+"/failure.html")
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })
    
    request.write(jsonData);
    request.end();
    
    // console.log(FName, LName, Email);
    // console.log(JSON.stringify(req.body));
    // res.send("Hello "+FName+"! thank you for sign up. Your login details is sent to your mail ( "+Email+" )");
    
});

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function(){
   console.log("Server is running on port 3000");
});



// Mailchimp APIkey- 85a66464deee073afa2a32f44609df2a-us11
// ListID - 200a344573