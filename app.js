//jshint esversion: 6

const apiKey= "8c2ac2f263d3d685cacb8e071f3ce6ae-us21";
const listId= "29b5e8c777";

const express= require("express");
const request= require("request");
const bodyParser= require("body-parser");
const https= require("https");
const { METHODS } = require("http");

const app= express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.sendFile(__dirname+ '/signup.html');
})

app.post("/", (req, res)=>{
    const firstName= req.body.fName;
    const lastName=  req.body.lName;
    const email= req.body.email;

    const data= {
        members:[{
            email_address: email,
            status: "subscribed",
            merge_fields:{
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    const jsonData= JSON.stringify(data);

    const url= "https://us21.api.mailchimp.com/3.0/lists/"+ listId;

    const options= {
        method: "POST",
        auth: "radhe:8c2ac2f263d3d685cacb8e071f3ce6ae-us21"
    }

    const request= https.request(url, options, function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+ "/success.html");
        }else{
            res.sendFile(__dirname+ "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.post("/success", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, ()=>{
    console.log("server is running on port 3000");
})
