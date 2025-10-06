const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const { connection } = require("./config/db");
const { Usermodel } = require("./models/User.model");
const { blogRouter } = require("./routes/blog.routes");
const { passwordRouter } = require("./routes/password.routes");
const { authentication } = require("./middleware/authentication.middleware");

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true 
}));

app.get("/health", (req, res) => {
  res.send({ message: "Api is working" });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: "All fields are required" });
  }
  try {
    // Check if user already exists
    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(409).send({ message: "User already exists" });
    }

    //password hashing
    bcrypt.hash(password, 5, async function (err, hash) {
      if (err) {
        console.error("Hashing error:", err);
        return res.status(500).send({ message: "Error while signing up" });
      }
      await Usermodel.create({ name, email, password: hash });
      return res.status(201).send({ message: "Signup successful" });
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).send({ message: "Error while signing up" });
  }
});
//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const user = await Usermodel.findOne({ email });

    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    const hash = user.password;
    bcrypt.compare(password, hash, function (err, result) {
      if (err) {
        console.error("Comparison error:", err);
        return res.status(500).send({ message: "Error during login" });
      }
      if (result) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.send({ message: "Login is successfull", token: token });
      } else {
        return res.status(401).send({ message: "Invalid credentials" });
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Error during login" });
  }
});

// Password reset routes (no authentication required)
app.use("/password", passwordRouter);

app.use(authentication);
app.use("/blogs", blogRouter);

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  try {
    await connection;
    console.log({ Message: "connected to mongodb successfully" });
  } catch (error) {
    console.log({ message: "error while connecting to mongodb" });
    console.log(error);
  }
  console.log(`Server is running on ${port}`);
});
