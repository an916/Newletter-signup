const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();//new instance of app so that we can use it

app.use(express.static("public"));//static is a method in express by which we can use our static css and images to send to our server coz if we dont use this then in signup.html we cannot send image and css using server
app.use(bodyParser.urlencoded({extended: true}));//using body parser

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {//it is a js object
    members : [//members is key that is recognized by api and members have its own keys like below email statusand others
      {
        email_address: email,//here we are providing entered values by user to our api to register
        status: "subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);//we are turning above values to flatpack json from javascript objects
//we send jsonData to mailchimp that is why we need to convert it to flatpack json
  const url = "https://us7.api.mailchimp.com/3.0/lists/748a0ab9d2"

  const options = {
      method: "POST",//here we are telling that method would be post in https request
      auth: "anuj:fa35d5b60ec71fb0df1ad6f61de0bb7b-us7"//it is a way of authentication
  }

  const request = https.request(url , options , function(response){//making request to mailchimp servers

      if(response.statusCode===200){
        res.sendFile(__dirname + "/success.html");
      }
      else {
        res.sendFile(__dirname + "/failure.html");
      }

      response.on("data",function(data){//in this method we are getting back data from api
        console.log(JSON.parse(data));
      })
  })
  request.write(jsonData);//it writes data to request body means we send data mailchimp to use it
  //and write the data into our list 
  request.end();
});

app.post("/failure", function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
  console.log("server running on port 3000");
});

//api id
//fa35d5b60ec71fb0df1ad6f61de0bb7b-us7
//list // ID
//748a0ab9d2
