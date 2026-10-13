const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Service = require("./models/Service");

dotenv.config();

const services = [
  {
    name: "General Consultation",
    description:
      "Consultation with experienced doctors for common health problems and medical concerns.",
    icon: "FaUserMd",
    image: "",
  },
  {
    name: "Cardiology",
    description:
      "Specialized care for heart-related conditions, diagnosis, and treatment.",
    icon: "FaHeart",
    image: "",
  },
  {
    name: "Dermatology",
    description:
      "Diagnosis and treatment of skin, hair, and nail conditions.",
    icon: "FaAllergies",
    image: "",
  },
  {
    name: "Orthopedics",
    description:
      "Treatment and management of bone, joint, muscle, and ligament problems.",
    icon: "FaBone",
    image: "",
  },
  {
    name: "Gynecology",
    description:
      "Comprehensive healthcare services for women's reproductive health.",
    icon: "FaFemale",
    image: "",
  },
  {
    name: "Diagnostics & Tests",
    description:
      "Access essential diagnostic tests to help doctors accurately assess your health.",
    icon: "FaMicroscope",
    image: "",
  },
];

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Service.deleteMany();

    await Service.insertMany(services);

    console.log("Services added successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding services failed:", error);
    process.exit(1);
  }
};

seedServices();