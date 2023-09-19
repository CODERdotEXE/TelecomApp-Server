// insertPlans.js

const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// Your other imports and configurations...

const mongoURI = process.env.MONGO_URI;
 // Replace with your MongoDB URI
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// insertPlans.js

const planSchema = new mongoose.Schema({
    "planID":Number,
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
  
  const planDetails = [
    {
      "planID":1,
      "planName": "Fibre Entry [Promo offer for a period of 90 days w.e.f. 02-05-2023]",
      "fmc": 329,
      "bandwidth": "Up to 20 Mbps till 1000 GB",
      "fupSpeed": "4 Mbps",
      "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
      "freeOTT": "-",
      "securityDeposit": "Rs. 500/-",
      "advancePayment": {
        c1: "5.5 months FMC - 6 Months",
        c2: "12 Months FMC - 13 Months Service",
        c3: "24 Months FMC- 27 Months Service",
        c4: "36 Months FMC- 40 Months Service"
      }
    },
    {
      "planID":2,  
      "planName": " Rural HOME WiFi / GHAR KA WiFi w.e.f. 15-12-2022",
        "fmc": 399,
        "bandwidth": "Up to 30 Mbps till 1000 GB",
        "fupSpeed": "4 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "-",
        "securityDeposit": "Rs. 500/-",
        "advancePayment": {
          c1: "Rs. 1999/- +GST",
          c2: "12 Months FMC - 13 Months Service",
          c3: "24 Months FMC- 27 Months Service",
          c4: "36 Months FMC- 40 Months Service"
        }
      },
      {
        "planID":3,
        "planName": "Fibre Basic NEO [New users only] Minimum Hire Period- 1 month",
        "fmc": 449,
        "bandwidth": "Up to 30 Mbps till 3300 GB",
        "fupSpeed": "4 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "-",
        "securityDeposit": "Rs. 500/-",
        "advancePayment": {
          c1: "-",
          c2: "-",
          c3: "-",
          c4: "-"
        }
      },
      {
        "planID":4,
        "planName": " Fibre Basic",
        "fmc": 499,
        "bandwidth": "	Up to 40 Mbps till 3300 GB",
        "fupSpeed": "4 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "-",
        "securityDeposit": "Rs. 500/-",
        "advancePayment": {
          c1: "5.5 months FMC - 6 Months",
          c2: "12 Months FMC - 13 Months Service",
          c3: "24 Months FMC- 27 Months Service",
          c4: "36 Months FMC- 40 Months Service"
        }
      },
      {
        "planID":5,
        "planName": "Fibre Basic Plus",
        "fmc": 599,
        "bandwidth": "60 Mbps till 3300 GB",
        "fupSpeed": "2 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "-",
        "securityDeposit": "Rs. 500/-",
        "advancePayment": {
          c1: "5.5 months FMC - 6 Months",
          c2: "12 Months FMC - 13 Months Service",
          c3: "24 Months FMC- 27 Months Service",
          c4: "36 Months FMC- 40 Months Service"
        }
      },
      {
        "planID":6,
        "planName": "Fibre Basic Plus OTT * w.e.f. 27-01-2023",
        "fmc": 666,
        "bandwidth": "	Up to 60 Mbps till 3300GB",
        "fupSpeed": "4 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "Disney + Hotstar Super Plan",
        "securityDeposit": "-",
        "advancePayment": {
          c1: "5.5 months FMC - 6 Months",
          c2: "12 Months FMC - 13 Months Service",
          c3: "24 Months FMC- 27 Months Service",
          c4: "36 Months FMC- 40 Months Service"
        }
      },
      {
        "planID":7,
        "planName": " Fibre TB Plan ",
        "fmc": 777,
        "bandwidth": "Up to 100 Mbps till 1500 GB",
        "fupSpeed": "5 Mbps",
        "voiceCall": "24 Hrs unlimited free calling (Local+STD) on any network within India",
        "freeOTT": "-",
        "securityDeposit": "-",
        "advancePayment": {
          c1: "5.5 months FMC - 6 Months",
          c2: "12 Months FMC - 13 Months Service",
          c3: "24 Months FMC- 27 Months Service",
          c4: "36 Months FMC- 40 Months Service"
        }
      },
  ];
// insertPlans.js

async function insertPlans() {
    try {
      await Plan.insertMany(planDetails);
      console.log('Plan details inserted successfully.');
    } catch (error) {
      console.error('Error inserting plan details:', error);
    } finally {
      db.close();
    }
  }
  
  insertPlans();
    