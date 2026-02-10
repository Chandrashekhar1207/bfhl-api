require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const EMAIL = process.env.OFFICIAL_EMAIL || "test@chitkara.edu.in";

// ---------- Utility Functions ----------

// Fibonacci (returns first n+1 terms like example)
function getFibonacci(n) {
  if (n < 0) return null;
  const arr = [0, 1];
  for (let i = 2; i <= n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n + 1);
}

// Prime check
function isPrime(num) {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

// GCD
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// HCF
function getHCF(arr) {
  return arr.reduce((a, b) => gcd(a, b));
}

// LCM
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function getLCM(arr) {
  return arr.reduce((a, b) => lcm(a, b));
}

// AI response
async function getAIResponse(question) {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          parts: [
            { text: `Answer in ONE word only: ${question}` }
          ]
        }
      ]
    };

    const res = await axios.post(url, body, {
      headers: { "Content-Type": "application/json" }
    });

    let text =
      res.data.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown";

    return text.split(/\s+/)[0]; // ensure single word
  } catch (error) {
    console.error("Gemini Error:", error.response?.data || error.message);
    return "Error";
  }
}



// ---------- Routes ----------

// Root route (prevents 404 on base URL)
app.get("/", (req, res) => {
  res.send("BFHL API is running");
});

// Health route
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

// Main route
app.post("/bfhl", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Invalid JSON body"
      });
    }

    const keys = Object.keys(req.body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key required"
      });
    }

    const key = keys[0];
    const value = req.body[key];
    let result;

    switch (key) {
      case "fibonacci":
        if (!Number.isInteger(value) || value < 0) {
          return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            error: "Invalid fibonacci input"
          });
        }
        result = getFibonacci(value);
        break;

      case "prime":
        if (!Array.isArray(value)) {
          return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            error: "Prime input must be array"
          });
        }
        result = value.filter(isPrime);
        break;

      case "hcf":
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            error: "Invalid hcf input"
          });
        }
        result = getHCF(value);
        break;

      case "lcm":
        if (!Array.isArray(value) || value.length === 0) {
          return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            error: "Invalid lcm input"
          });
        }
        result = getLCM(value);
        break;

      case "AI":
        if (typeof value !== "string") {
          return res.status(400).json({
            is_success: false,
            official_email: EMAIL,
            error: "AI input must be string"
          });
        }
        result = await getAIResponse(value);
        break;

      default:
        return res.status(400).json({
          is_success: false,
          official_email: EMAIL,
          error: "Invalid key"
        });
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      is_success: false,
      official_email: EMAIL,
      error: "Internal server error"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
