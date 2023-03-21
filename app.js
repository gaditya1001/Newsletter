const express = require("express");
const app = express();
const https = require('https');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname)); //When we run this server, the static files like images and stylesheets in local path will not load.
                                   //So we need to write this express.static. Note - if the full path is specified in the HTML(As done in this case,
                                   //then we only write __dirname here. If the path in HTML was /images/logo.jpg , then we had to write __dirname + "public" here.
                                   // So basically, the complete path is the path mentioned here + path in HTML

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/",function(req,res){
    var firstName = req.body.FirstName;
    var lastName = req.body.LastName;
    var email = req.body.Email;
    console.log(firstName,lastName,email);

    var data = {
    members : [
        {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME:firstName,
                LNAME:lastName
            }
        }
    ]
}

const jsonData = JSON.stringify(data);

const url="https://us21.api.mailchimp.com/3.0/lists/3fad15a213"
 const options = {
    method: "POST",
    auth:"Aditya1:af3e2eb34d0a250837d495214222c22bc-us21"
 }

const request = https.request(url,options,function(response){
    if(response.statusCode === 200)
    {
        res.sendFile(__dirname + "/success.html");
    }
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    response.on("data",function(data){
        console.log(JSON.parse(data));
    })
})
request.write(jsonData);
request.end();

})


app.post("/failure",function(req,res){
    res.redirect("/");
    //This can also be done -- res.sendFile(__dirname + "/signup.html");
})

app.listen(process.env.PORT || 3000,function(){
    console.log("Server is up and running on port:3000");
})


//f3e2eb34d0a250837d495214222c22bc-us21
//3fad15a213