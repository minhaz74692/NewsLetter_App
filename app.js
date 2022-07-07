const express = require("express");
const bodyParser = require("body-parser");
const https = require("https")
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));
app.get("/", (req, res) => res.sendFile(__dirname + "/index.html"));


app.post("/", (req, res) => {
    const fName = req.body.fName
    const lName = req.body.lName;
    const email = req.body.email;

    //Mailchimp create Audience
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: fName,
                    LNAME: lName
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);

    const url = 'https://us8.api.mailchimp.com/3.0/lists/430e69b541';
    const options = {
        method: "POST",
        auth: "MinhazulIslam:38b5a4afc69f24b1acae8bc51a21f3b5-us8"
    }
    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();
});

//Success Route
app.post("/success.html", (req, res) => {
    res.redirect("/");
})

//failure route
app.post("/failure.html", (req, res) => {
    res.redirect("/");
})

const port = 5000;
app.listen(process.env.PORT || port, () => {
    console.log("Your NewsLetterApp is listhenig Port "+ port);
})


//MailChimp API
// apiKey: "38b5a4afc69f24b1acae8bc51a21f3b5-us8",
// server-prefix: "us8",
// List/Adience ID: 430e69b541