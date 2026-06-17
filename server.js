const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/stkpush", async (req, res) => {
  try {
    const { phone } = req.body;

    const response = await axios.post(
      "https://paynecta.co.ke/api/v1/payment/initialize",
      {
        code: "PNT_532494",
        mobile_number: phone,
        amount: 500
      },
      {
        headers: {
          "X-API-Key": process.env.PAYNECTA_API_KEY,
          "X-User-Email": process.env.PAYNECTA_EMAIL,
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

app.listen(process.env.PORT || 10000);
