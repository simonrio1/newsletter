const express = require("express");
const bodyParser = require("body-parser");
// const requestModule = require("request");
// const axios = require("axios");
const mailchimp = require("@mailchimp/mailchimp_marketing");


const port = process.env.PORT;

app = express();

// To allow use of static files
app.use(express.static("public"));

// To be able to retrieve info from the body of the web page
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", (req, res) => {

    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.emailAddress
    };


    run_mailchimp_addMember(user, res);
    
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.listen(port || 3000, () => {
    console.log("Server running on port ", port);
})





// MailChimp API Key
// a8e74b5ec70168b8c92fc80aa419c3ae-us9
// MailChimp List Id
// 346782920d

mailchimp.setConfig({
    apiKey: "a8e74b5ec70168b8c92fc80aa419c3ae-us9",
    server: "us9",
});

const listId = "346782920d";

async function run_mailchimp_addMember(subscribingUser, res) {
    try {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });

        console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
        res.sendFile(__dirname + "/success.html");

    } catch (e) {
        console.log(e);
        res.sendFile(__dirname + "/failure.html");
    }
    
}
