var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'appsdny@gmail.com',
    pass: 'lqluebudwozpolck'
  },
  port:465,
  host:"smtp.gmail.com"
});

var regestereduserMail = {
  from: 'appsdny@gmail.com',
  to: 'deepayan.622@gmail.com',
  subject: 'Successfully Registered at OTS-Pocket applicatin',
  text: `Hi User,
Congratulation you are successfully regestered in OTS-Pocket application. Your Profile is shared with the management team for approval.

Your login id: deepayan.622@gmail.com
password: Test@1234

* Do Not Share this mail with anyone else *
        
We will let you know as soon as your profile got validated.

Thank you 
Team OTS-Pocket`      
};
var regestrationAdimnMail = {
    from: 'appsdny@gmail.com',
    to: 'dnyindia@gmail.com',
    subject: 'New user registration at OTS-Pocket application',
    text: `Hello Admin,
A new user is waiting for validation.

User Details
    Full name: Deepayan Nandy
    email: deepayan.622@gmail.com
    branch: Pasadena, TX 77506
    contact: 7384213622
  
* Do Not Share this mail with anyone else *
  
Thank you 
Team OTS-Pocket`      
  };


function sendMail(email){
    console.log(email);
}
transporter.sendMail(regestereduserMail, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }});

transporter.sendMail(regestrationAdimnMail, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
});
sendMail("hello");
