const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount } = req.body;
    if (!/^2547\d{8}$/.test(phone)) {
  return res.status(400).json({
    success: false,
    error: {
      message: "Only Safaricom numbers starting with 07 are supported."
    }
  });
    }
    console.log("REQUEST BODY:");
console.log(req.body);

console.log("PHONE RECEIVED:", phone);
console.log("AMOUNT:", amount);
    console.log("PAYNECTA PAYLOAD:");
console.log({
    code: "PNT_532494",
    mobile_number: phone,
    amount: amount
});
    const response = await axios.post(
      "https://paynecta.co.ke/api/v1/payment/initialize",
      {
        code: "PNT_532494",
        mobile_number: phone,
        amount: amount
      },
      {
        headers: {
          "X-API-Key": process.env.PAYNECTA_API_KEY,
          "X-User-Email": process.env.PAYNECTA_EMAIL,
          "Content-Type": "application/json"
        }
      }
    );

console.log("PAYNECTA RESPONSE:");
console.log(response.data);

    res.json(response.data);

  } catch (error) {
    console.log("PHONE REJECTED:", req.body.phone);

console.log("PAYNECTA ERROR:");
console.log(JSON.stringify(error.response?.data, null, 2));

res.status(error.response?.status || 500).json({
    success: false,
    error: error.response?.data || {
        message: error.message
    }
});

  }
});

app.listen(process.env.PORT || 10000, () => {
  console.log("Server started successfully");
});
