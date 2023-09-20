// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Feedback = require('./models/feedbackModel'); // Import the Feedback model
require('dotenv').config(); // Load environment variables from .env file

// Your other imports and configurations...

const Transaction = require('./models/transactionModel'); // Import the Transaction model
const bodyParser = require('body-parser');
const router = express.Router();
const config = require('./config');
const AdminSession = require('./models/adminSessionModel');
const requestIp = require('request-ip'); 
const path = require('path');
const multer = require('multer');
const Complaint = require('./models/complaintModel');

const app = express();
const port = 5000; // You can change this port if needed

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
}));


// Connect to MongoDB using your MongoDB URI
const mongoURI = process.env.MONGO_URI;
 // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define your schema and model for plans
const planSchema = new mongoose.Schema({
  "planID": {
    type: Number,
    required: true,
    unique: true,
  },
  "planName": String,
  "fmc": Number,
  "bandwidth": String,
  "fupSpeed": String,
  "voiceCall": String,
  "freeOTT": String,
  "securityDeposit": String,
  "advancePayment": {
    c1: String,
    c2: String,
    c3: String,
    c4: String,
  }
});
const Plan = mongoose.model('Plan', planSchema);


// API endpoint to get plans
app.get('/api/plans', async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Error fetching plans' });
  }
});
//API endpoint to save new plans and add a plan ID
app.post('/api/plans', async (req, res) => {
  try {
    // Find the largest planID in the database
    const maxPlan = await Plan.findOne().sort({ planID: -1 });
    let nextPlanID = 1; // Default value for new plans

    if (maxPlan) {
      // If there are plans in the database, increment the largest planID by 1
      nextPlanID = maxPlan.planID + 1;
    }

    const planData = req.body;
    // Set the planID for the new plan
    planData.planID = nextPlanID;

    const plan = new Plan(planData);
    await plan.save();

    res.status(201).json(plan);
  } catch (error) {
    console.error('Error adding plan:', error);
    res.status(500).json({ error: 'Error adding plan' });
  }
});
// API endpoint to delete a plan by ID
app.delete('/api/plans/:id', async (req, res) => {
  try {
    const planId = req.params.id;
    const deletedPlan = await Plan.findOneAndDelete({ planID: planId });

    if (!deletedPlan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ error: 'Error deleting plan', details: error.message });
  }
});



// Define your schema and model for profiles
const profileSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  customerID: String,
  mobileNo: String,
  aadharNo: String,
  addressLine1: String,
  addressLine2: String,
  pin: String,
  district: String,
  city: String,
});

const Profile = mongoose.model('Profile', profileSchema);

app.use(bodyParser.json());

// API endpoint to get profile by email
app.get('/api/profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const profile = await Profile.findOne({ email });
    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

// API endpoint to update or save profile
app.post('/api/profile', async (req, res) => {
  const { profileData } = req.body;

  try {
    let profile = await Profile.findOne({ email: profileData.email });

    if (!profile) {
      // Generate the customerID here
      profileData.customerID = generateCustomerID();
      profile = new Profile(profileData);
    } else {
      Object.assign(profile, profileData);
    }

    await profile.save();
    res.json({ profile });
  } catch (error) {
    console.error('Error updating/saving profile:', error);
    res.status(500).json({ error: 'Error updating/saving profile' });
  }
});

// Function to generate customerID (replace with your logic)
function generateCustomerID() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `BSNL${year}${month}${time}${random}`;
}


// API endpoint to handle feedback submissions
app.post('/api/feedback', async (req, res) => {
  const { rating, feedback } = req.body;

  try {
    // Create and save the feedback document
    const newFeedback = new Feedback({ rating, feedback });
    await newFeedback.save();

    res.json({ message: 'Feedback saved successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Error saving feedback' });
  }
});

// API endpoint to handle transactions
app.post('/api/transactions', async (req, res) => {
  const { planName, planValue } = req.body;

  try {
    const now = new Date();
    const year = now.getFullYear().toString().substr(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const time = now.getTime().toString().substr(-6);
    const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const transactionId = parseInt(year + month + time + randomDigits);

    // Create and save the transaction document
    const newTransaction = new Transaction({ transactionId, planName, planValue });
    await newTransaction.save();

    res.json({ message: 'Transaction saved successfully', transactionId });
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Error saving transaction' });
  }
});

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: './uploads', // Destination folder for uploaded images
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// API endpoint to handle complaint registration
app.post('/api/complaints', upload.single('imageFile'), async (req, res) => {
  const { complaintType, complaintDescription } = req.body;
  const imagePath = req.file ? req.file.path : '';
  const applicationNumberCounter = 202300001;
  try {
    // Find the greatest application number from existing complaints and increment it by 1
    const greatestApplicationNumber = await Complaint.findOne().sort('-applicationNumber');
    const applicationNumber = greatestApplicationNumber
      ? greatestApplicationNumber.applicationNumber + 1
      : applicationNumberCounter;

    // Create and save the complaint document
    const newComplaint = new Complaint({
      applicationNumber,
      complaintType,
      complaintDescription,
      imagePath,
    });
    await newComplaint.save();

    res.json({ message: 'Complaint registered successfully', applicationNumber });
  } catch (error) {
    console.error('Error registering complaint:', error);
    res.status(500).json({ error: 'Error registering complaint' });
  }
});


// API endpoint to track a complaint by applicationNumber
app.get('/api/complaints/:applicationNumber', async (req, res) => {
  const { applicationNumber } = req.params;

  try {
    const complaint = await Complaint.findOne({ applicationNumber });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ status: complaint.status });
  } catch (error) {
    console.error('Error tracking complaint:', error);
    res.status(500).json({ error: 'Error tracking complaint' });
  }
});
// API endpoint to fetch all complaints
app.get('/api/complaints', async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});


// API endpoint to update complaint status by application number
app.put('/api/complaints/:applicationNumber', async (req, res) => {
  const { applicationNumber } = req.params;
  const { status } = req.body;

  try {
    const complaint = await Complaint.findOne({ applicationNumber });

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.json({ message: 'Complaint status updated successfully' });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ error: 'Error updating complaint status' });
  }
});


// Use the request-ip middleware to get the user's IP address
app.use(requestIp.mw());

// Endpoint for admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  // Get the client's IP address
  const ipAddress = req.clientIp;


  // Hardcoded admin credentials (in a real app, you would use a database)
  if (username === config.adminUsername && password === config.adminPassword) {
    // Successful login

    // Log login time
    const loginTime = new Date();

    // Create a new admin session entry
    const adminSession = new AdminSession({
      username,
      email: 'admin@example.com', // You can set this based on your admin data
      loginTime,
      ipAddress, // Save the IP address
    });

    await adminSession.save();

    res.json({ success: true });
  } else {
    // Invalid credentials
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});


// Endpoint for admin logout
app.post('/api/admin/logout', async (req, res) => {
  const { username } = req.body;

  // Find the admin session entry based on username
  const adminSession = await AdminSession.findOne({ username }).sort({ loginTime: -1 });

  if (adminSession) {
    // Log logout time
    adminSession.logoutTime = new Date();

    // Calculate session duration
    const durationMilliseconds = adminSession.logoutTime - adminSession.loginTime;
    adminSession.sessionDuration = `${Math.floor(durationMilliseconds / 60000)} minutes`;

    await adminSession.save();

    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: 'Admin session not found' });
  }
});

// Add a new route to get the session start time
app.get('/api/admin/sessionStartTime', async (req, res) => {
  try {
    const latestSession = await AdminSession.findOne({}, {}, { sort: { 'loginTime': -1 } });

    if (latestSession) {
      res.json({ sessionStartTime: latestSession.loginTime });
    } else {
      res.json({ sessionStartTime: null });
    }
  } catch (error) {
    console.error('Error fetching session start time:', error);
    res.status(500).json({ error: 'Error fetching session start time' });
  }
});


app.listen(port, () => {
  console.log('Server is connected to MongoDB... Telecom Backend is Running');
});
