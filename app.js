const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
//specifies the static folder that has al pr dtatic files
// to use these files ,we use relative path.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//on requesting the / page, we send the page as a response
app.get('/',function(req,res)
{
  res.sendFile(__dirname +'/signup.html');
});

//the server picks the post request data in this route
app.post('/',function(req,res)
{
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email =  req.body.email;
  //array object
  var data = {
    members:[
      {
        email_address:email,
        status:'subscribed',
        merge_fields:{
          FNAME : fname,
          LNAME :lname
        },
      }
    ]
  };
const jsonData = JSON.stringify(data); //converting to json
const url = " https://us21.api.mailchimp.com/3.0/lists/1530a5be0d";
//javascript obj
const options = {
  method:"POST",
  //auth:"auername:apiKey"
  auth:"annie:54ed5c8b32eb3370b4049139b7a4b7b7-us21"
}
//post data to the external resource, a  callback gives a response from the mailchimp server
//Makes a request to a secure web server
const request = https.request(url,options,function(response){
  if(response.statusCode == 200){
    res.sendFile(__dirname+"/success.html");
  }
  else{
    res.sendFile(__dirname+"/failure.html");
  }
  //when we get back a response we check what data they sent us frmo the mailchmp server
  //on recieving a response, console the data
  response.on("data",function(data){
    console.log(JSON.parse(data));
  })
})
//passing the data  to the mailchimp server, to save it
request.write(jsonData);
//done with the request
request.end();
});
//failue route
//if a post request route was made to failure page then perform the given action
app.post('/failure', function(req,res){
  res.redirect('/');
})
app.listen(3000,function()
{
  console.log("Server is running on port 3000");
});
//54ed5c8b32eb3370b4049139b7a4b7b7-us21 - apikey
// 1530a5be0d audience id/list id (the list we want to put our subscribers into
