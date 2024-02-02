import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Add this line for CORS support
import bcrypt from "bcryptjs";
import Bill from "./BillModel.js";
import User from "./UserModel.js";
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Add this line to parse JSON data in the request body

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("connected to db!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log("server running on port 3000!!");
});

//signup user
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// signin user
app.post("/api/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate a token without expiration
    const token = jwt.sign({ userId: user._id, email: user.email }, '897320yhr3287yhb327y');

    // Send the token in the response
    res.status(200).json({ success: true, message: "Sign-in successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//create a bill
app.post("/api/createBill", async (req, res) => {
  const { billno, companyname, amount } = req.body;

  if (!billno || !companyname || !amount) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const newBill = new Bill({ billno, companyname, amount });

  try {
    await newBill.save();
    res.status(201).json({
      success: true,
      message: "Bill created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      statusCode: error.status,
    });
  }
});

//get all bills
app.get("/api/getAllBills", async (req, res) => {
  try {
    const allBills = await Bill.find();
    res.status(200).json({
      success: true,
      data: allBills.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//get bill by id
app.get("/api/getBillById/:id", async (req, res) => {
  const billId = req.params.id;
  try {
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//update a bill
app.put("/api/updateBill/:id", async (req, res) => {
  const { billno, companyname, amount } = req.body;
  const billId = req.params.id;

  try {
    const updatedBill = await Bill.findByIdAndUpdate(
      billId,
      { billno, companyname, amount },
      { new: true }
    );

    if (!updatedBill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found",
      });
    }

    res.status(200).json({
      success: false,
      data: updatedBill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

//delete a bill
app.delete("/api/deleteBill/:id", async (req, res) => {
  const billId = req.params.id;

  const deletedBill = await Bill.findByIdAndDelete(billId);

  if (!deletedBill) {
    return res.status(404).json({
      success: false,
      message: "Bill not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Bill deleted successfully",
  });
});
