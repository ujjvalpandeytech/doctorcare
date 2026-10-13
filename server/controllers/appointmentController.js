const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");


const convertToMinutes = (time) => {
  const match = time.trim().match(
    /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );

  if (!match) {
    return null;
  }

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (hours === 12) {
    hours = 0;
  }

  if (period === "PM") {
    hours += 12;
  }

  return hours * 60 + minutes;
};

const convert24HourToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }

  return hours * 60 + minutes;
};

const isTimeAvailable = (selectedTime, availableTime) => {
  if (!selectedTime || !availableTime) {
    return false;
  }

  const parts = availableTime.split("-");

  if (parts.length !== 2) {
    return true;
  }

  const start = convertToMinutes(parts[0]);
  const end = convertToMinutes(parts[1]);

  const selected = convert24HourToMinutes(selectedTime);

  if (
    start === null ||
    end === null ||
    selected === null
  ) {
    return false;
  }

  return selected >= start && selected <= end;
};

// Create a new appointment
const createAppointment = async (req, res) => {
  try {
    const {
      doctor,
      appointmentDate,
      appointmentTime,
      doctorType,
      comments,
    } = req.body;

    // Validate required fields
    if (
      !doctor ||
      !appointmentDate ||
      !appointmentTime ||
      !doctorType
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor, date, time and doctor type are required",
      });
    }

    // Check if doctor exists and is active
    const selectedDoctor = await Doctor.findOne({
      _id: doctor,
      isActive: true,
    });
   
    if (!selectedDoctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    // Check whether the selected date is in the past
const selectedDate = new Date(appointmentDate);

const today = new Date();
today.setHours(0, 0, 0, 0);

if (selectedDate < today) {
  return res.status(400).json({
    success: false,
    message: "Appointment date cannot be in the past",
  });
}

// Check doctor's available day
const appointmentDay = selectedDate.toLocaleDateString(
  "en-US",
  {
    weekday: "long",
  }
);

if (
  selectedDoctor.availableDays.length > 0 &&
  !selectedDoctor.availableDays.includes(appointmentDay)
) {
  return res.status(400).json({
    success: false,
    message: `Doctor is not available on ${appointmentDay}`,
  });
}

// Check doctor's available time
if (
  selectedDoctor.availableTime &&
  !isTimeAvailable(
    appointmentTime,
    selectedDoctor.availableTime
  )
) {
  return res.status(400).json({
    success: false,
    message: `Please select a time between ${selectedDoctor.availableTime}`,
  });
}

    // Check if doctor is already booked
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: {
        $in: ["Pending", "Confirmed"],
      },
    });

    if (existingAppointment) {
      return res.status(409).json({
        success: false,
        message:
          "This doctor is already booked for this date and time",
      });
    }

    
    // Medical report upload
let report = "";

if (req.file) {
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "doctorcare/reports",
    resource_type: "raw",
  });

  report = result.secure_url;

  // Delete temporary file after Cloudinary upload
  await fs.unlink(req.file.path).catch(() => {});
}


    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      doctorType,
      comments: comments || "",
      report,
    });

    // Return appointment with doctor and patient details
    const populatedAppointment =
      await Appointment.findById(appointment._id)
        .populate(
          "doctor",
          "name specialization qualification experience consultationFee"
        )
        .populate(
          "patient",
          "name email phone"
        );

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment: populatedAppointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while creating appointment",
    });
  }
};

// Get appointments of logged-in patient
const getMyAppointments = async (req, res) => {
  try {
    const { year } = req.query;

    const query = {
      patient: req.user._id,
    };

  // Filter appointments by year
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${Number(year) + 1}-01-01`);

      query.appointmentDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const appointments = await Appointment.find(query)
      .populate(
        "doctor",
        "name specialization qualification experience consultationFee"
      )
      .sort({
        appointmentDate: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
  console.error("Create appointment error:", error);

  if (req.file?.path) {
    await fs.unlink(req.file.path).catch(() => {});
  }

  res.status(500).json({
    success: false,
    message: "Server error while creating appointment",
  });
}
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.status === "Cancelled" ||
      appointment.status === "Completed"
    ) {
      return res.status(400).json({
        success: false,
        message: `Appointment cannot be cancelled because it is already ${appointment.status.toLowerCase()}`,
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while cancelling appointment",
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
};