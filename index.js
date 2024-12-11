// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { appCheck } = require("firebase-admin");
// dotenv.config();
// require("dotenv").config();

// const stripe = require("stripe")(process.env.STRIPE_KEY);

// const app = express();
// app.use(cors({ origin: true }));

// app.use(express.json());

// app.get("/", (req, res) => {
//   res.status(200).json({
//     message: "success",
//   });
// });

// app.post("/payment/create", async (req, res) => {
//   const total = req.query.total;
//   if (total > 0) {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: total,
//       currency: "USD",
//     });

//     res.status(201).json(
//       //   paymentIntent
//       {
//         clientSecret: paymentIntent.client_secret,
//         //   paymentIntent,
//             // clientPaymentSecret: paymentIntent.client_secret,
//       }
//     );

//     // console.log("payment recieved", total)
//     // res.send(total)
//   } else {
//     res.status(403).json({
//       message: "Payment amount must be greater than zero (0).",
//     });
//   }
// });

// app.listen(5000, (err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log("Amazon server running on PORT: 5000 on http://localhost:5000");
// });

// // exports.api = onRequest(app);


const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_KEY);

if (!process.env.STRIPE_KEY) {
  throw new Error("Stripe API key is missing in environment variables!");
}

const app = express();

// CORS configuration for production
app.use(
  cors({
    origin: "https://amazon-fullstack-bonright.netlify.app", // Replace with your deployed frontend domain
    methods: ["GET", "POST"], // Limit to the methods your API uses
  })
);


app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "success",
  });
});

// Payment creation route
app.post("/payment/create", async (req, res) => {
  try {
    const total = req.query.total;

    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "USD",
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(403).json({
        message: "Payment amount must be greater than zero (0).",
      });
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Dynamic port for cloud platforms
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Amazon server running on PORT: ${PORT}`);
});

// For Firebase Cloud Functions (optional)
// const { onRequest } = require("firebase-functions/v2/https");
// exports.api = onRequest(app);
