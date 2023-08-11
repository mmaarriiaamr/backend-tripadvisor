require("dotenv").config();
const express = require("express");
const cors = require("cors");

const formData = require("form-data");
const Mailgun = require("mailgun.js");

const app = express();
app.use(express.json());
app.use(cors());

const mailgun = new Mailgun(formData);
const client = mailgun.client({
  username: "Maria Munoz Rodriguez",
  key: process.env.MAILGUN_API_KEY,
});

//console.log(client)

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the backend of TripAdvisor" });
});

app.post("/form", async (req, res) => {
  const { firstname, lastname, email, message } = req.body;

  const messageData = {
    from: `${firstname}  ${lastname} ${email}`,
    to: "mariamunozrodriguez03@gmail.com",
    subject: "Form",
    text: message,
  };

  //console.log(messageData);

  try {
    const response = await client.messages.create(
      process.env.MAILGUN_DOMAIN,
      messageData
    );

    console.log('Your message has been sent successfully')
    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json(error);
  }
});

app.all("*", (req, res) => {
  console.log("route not found");
  res.status(404).json({ message: "Page not found" });
});


app.listen(process.env.PORT, (err, res) => {
  console.log("TripAdvisor backend running in port:" + process.env.PORT);
});