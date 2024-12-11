const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { appCheck } = require("firebase-admin");
dotenv.config();
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

const app = express();
app.use(cors({ origin: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

app.post("/payment/create", async (req, res) => {
  const total = req.query.total;
  if (total > 0) {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total,
      currency: "USD",
    });

    res.status(201).json(
      //   paymentIntent
      {
        clientSecret: paymentIntent.client_secret,
        //   paymentIntent,
            // clientPaymentSecret: paymentIntent.client_secret,
      }
    );

    // console.log("payment recieved", total)
    // res.send(total)
  } else {
    res.status(403).json({
      message: "Payment amount must be greater than zero (0).",
    });
  }
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Amazon server running on PORT: 5000 on http://localhost:5000");
});

// exports.api = onRequest(app);
