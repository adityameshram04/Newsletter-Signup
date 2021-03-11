//jshint esversion:6
const express = require("express");

const bodyParser = require("body-parser");

const request = require("request");

const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true})); //mandatory


app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
});

app.post("/",function(req,res){

    var firstName = req.body.fName;
    var lastName = req.body.lName;
    var email = req.body.email;
    
    //Now we're going to parse this data into json
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName  
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us1.api.mailchimp.com/3.0/lists/000f029cac";
    const options = {
        method: "POST",
        auth: "aditya1:4a673daa5b147284fe2115d3275ca31d-us1"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + "/success.html");
        }
        else
        {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();



});


app.post("/failure",function(req,res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000,function(){
    console.log("The server is running on port 3000!");
});


//API Key : 4a673daa5b147284fe2115d3275ca31d-us1

//List_id : 000f029cac
