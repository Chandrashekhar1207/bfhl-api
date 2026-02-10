# BFHL API

REST API developed for the Chitkara University Qualifier.

## Tech Stack

* Node.js
* Express.js
* Google Gemini API

## Endpoints

### GET /health

Returns API status.

**Response**

```json
{
  "is_success": true,
  "official_email": "chandra1808.be23@chitkara.edu.in"
}
```

---

### POST /bfhl

Accepts exactly one key in the request body:

| Key       | Description                      |
| --------- | -------------------------------- |
| fibonacci | Returns Fibonacci series         |
| prime     | Returns prime numbers from array |
| lcm       | Returns LCM of numbers           |
| hcf       | Returns HCF of numbers           |
| AI        | Returns one-word AI answer       |

**Example request**

```json
{
  "fibonacci": 7
}
```

**Success response**

```json
{
  "is_success": true,
  "official_email": "chandra1808.be23@chitkara.edu.in",
  "data": [0,1,1,2,3,5,8]
}
```

---

GET https://bfhl-api-ysqe.onrender.com/health
POST https://bfhl-api-ysqe.onrender.com/bfhl

## Author

Chandra Shekhar Kumar
[chandra1808.be23@chitkara.edu.in](mailto:chandra1808.be23@chitkara.edu.in)
