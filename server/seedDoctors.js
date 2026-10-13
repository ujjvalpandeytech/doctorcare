const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Doctor = require("./models/Doctor");

dotenv.config();

const doctors = [
  {
    name: "Dr. Rahul Sharma",
    specialization: "Cardiologist",
    qualification: "MBBS, MD, DM Cardiology",
    experience: 10,
    consultationFee: 800,
    image: "",
    availableDays: ["Monday", "Wednesday", "Friday"],
    availableTime: "10:00 AM - 2:00 PM",
  },
  {
    name: "Dr. Priya Verma",
    specialization: "Dermatologist",
    qualification: "MBBS, MD Dermatology",
    experience: 7,
    consultationFee: 600,
    image: "",
    availableDays: ["Tuesday", "Thursday", "Saturday"],
    availableTime: "11:00 AM - 3:00 PM",
  },
  {
    name: "Dr. Amit Patel",
    specialization: "General Physician",
    qualification: "MBBS, MD Medicine",
    experience: 12,
    consultationFee: 500,
    image: "",
    availableDays: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ],
    availableTime: "9:00 AM - 1:00 PM",
  },
  {
    name: "Dr. Neha Singh",
    specialization: "Gynecologist",
    qualification: "MBBS, MD Gynecology",
    experience: 9,
    consultationFee: 700,
    image: "",
    availableDays: ["Monday", "Wednesday", "Saturday"],
    availableTime: "2:00 PM - 5:00 PM",
  },
  {
    name: "Dr. Arjun Mehta",
    specialization: "Orthopedic",
    qualification: "MBBS, MS Orthopedics",
    experience: 11,
    consultationFee: 750,
    image: "",
    availableDays: ["Tuesday", "Thursday", "Friday"],
    availableTime: "4:00 PM - 7:00 PM",
  },
];

const seedDoctors = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Doctor.deleteMany();

    await Doctor.insertMany(doctors);

    console.log("Doctors added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding doctors failed:", error);
    process.exit(1);
  }
};

seedDoctors();