import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserMd, FaCalendarAlt, FaClock, FaFileUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../components/DashboardLayout"
import { getDoctors } from "../redux/slices/doctorSlice";
import api from "../services/api";

const BookAppointment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { doctors, loading } = useSelector((state) => state.doctor);

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    comments: "",
  });

  const [report, setReport] = useState(null);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    dispatch(getDoctors());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleReportChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG, PNG, WEBP and PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Report size must be less than 5 MB");
      return;
    }

    setReport(file);
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);

    setFormData({
      appointmentDate: "",
      appointmentTime: "",
      comments: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor) {
      toast.error("Please select a doctor");
      return;
    }

    if (!formData.appointmentDate) {
      toast.error("Please select an appointment date");
      return;
    }

    if (!formData.appointmentTime) {
      toast.error("Please select an appointment time");
      return;
    }
  if (
  !isTimeWithinAvailability(
    formData.appointmentTime,
    selectedDoctor.availableTime
  )
) {
  toast.error(
    `Please select a time between ${selectedDoctor.availableTime}`
  );
  return;
}  

    try {
      setBooking(true);

      const data = new FormData();

      data.append("doctor", selectedDoctor._id);
      data.append("doctorType", selectedDoctor.specialization);
      data.append("appointmentDate", formData.appointmentDate);
      data.append("appointmentTime", formData.appointmentTime);
      data.append("comments", formData.comments);

      if (report) {
        data.append("report", report);
      }

      const response = await api.post("/appointments", data);

      toast.success(response.data.message || "Appointment booked successfully");

      navigate("/appointments");
    } catch (error) {
      console.error("Booking error:", error);

      toast.error(
        error.response?.data?.message || "Failed to book appointment",
      );
    } finally {
      setBooking(false);
    }
  };

  const isTimeWithinAvailability = (selectedTime, availableTime) => {
  if (!selectedTime || !availableTime) {
    return false;
  }

  // Expected format: "10:00 AM - 2:00 PM"
  const parts = availableTime.split("-");

  if (parts.length !== 2) {
    return true;
  }

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

  const start = convertToMinutes(parts[0]);
  const end = convertToMinutes(parts[1]);

  const selectedParts = selectedTime.split(":");

  const selectedHours = Number(selectedParts[0]);
  const selectedMinutes = Number(selectedParts[1]);

  const selected = selectedHours * 60 + selectedMinutes;

  if (start === null || end === null) {
    return true;
  }

  return selected >= start && selected <= end;
};

const getTimeInputLimits = (availableTime) => {
  if (!availableTime) {
    return {
      min: "",
      max: "",
    };
  }

  const parts = availableTime.split("-");

  if (parts.length !== 2) {
    return {
      min: "",
      max: "",
    };
  }

  const convertTo24Hour = (time) => {
    const match = time.trim().match(
      /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
    );

    if (!match) {
      return "";
    }

    let hours = Number(match[1]);
    const minutes = match[2];
    const period = match[3].toUpperCase();

    if (period === "AM") {
      if (hours === 12) {
        hours = 0;
      }
    } else {
      if (hours !== 12) {
        hours += 12;
      }
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
  };

  return {
    min: convertTo24Hour(parts[0]),
    max: convertTo24Hour(parts[1]),
  };
};

const timeLimits = getTimeInputLimits(
  selectedDoctor?.availableTime
);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Book an Appointment
          </h1>

          <p className="text-gray-500 mt-1">
            Select a doctor and choose your preferred appointment time.
          </p>
        </div>

        {/* SELECTED DOCTOR */}
        {selectedDoctor && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 sm:p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Selected Doctor
              </h2>

              <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full">
                Selected
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl">
                <FaUserMd />
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">
                  {selectedDoctor.name}
                </h3>

                <p className="text-blue-600 font-medium">
                  {selectedDoctor.specialization}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedDoctor.qualification}
                </p>

                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                  <span>{selectedDoctor.experience} years experience</span>

                  <span>₹{selectedDoctor.consultationFee}</span>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-gray-500">Available</p>

                <p className="font-semibold text-gray-800">
                  {selectedDoctor.availableTime}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedDoctor.availableDays?.join(", ")}
                </p>
              </div>
            </div>
          </div>
        )}
        {/* APPOINTMENT FORM */}
        {selectedDoctor && (
          <form
            onSubmit={handleSubmit}
            className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Appointment Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DATE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>

                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* TIME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Time
                </label>

                <div className="relative">
                  <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="time"
                    name="appointmentTime"
                    value={formData.appointmentTime}
                    onChange={handleChange}
                    min={timeLimits.min}
                    max={timeLimits.max}
                    className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Doctor availability: {selectedDoctor.availableTime}
                </p>
              </div>

              {/* COMMENTS */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments / Health Concern
                </label>

                <textarea
                  name="comments"
                  value={formData.comments}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your health concern..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* REPORT */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Report
                </label>

                <label className="flex items-center gap-3 border-2 border-dashed border-gray-300 rounded-lg p-5 cursor-pointer hover:border-blue-400 transition">
                  <FaFileUpload className="text-blue-600 text-xl" />

                  <div>
                    <p className="font-medium text-gray-700">
                      {report ? report.name : "Upload medical report"}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, WEBP or PDF — Maximum 5 MB
                    </p>
                  </div>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleReportChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* BOOK BUTTON */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={booking}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {booking ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>
        )}
        
        {/* DOCTORS */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Choose a Doctor
          </h2>

          {loading ? (
            <p className="text-blue-600 font-semibold">Loading doctors...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <FaUserMd />
                  </div>

                  <h3 className="font-bold text-gray-800 mt-4">
                    {doctor.name}
                  </h3>

                  <p className="text-blue-600 mt-1">{doctor.specialization}</p>

                  <p className="text-sm text-gray-500 mt-2">
                    {doctor.qualification}
                  </p>

                  <p className="text-sm text-gray-500 mt-2">
                    {doctor.experience} years experience
                  </p>

                  <p className="font-bold text-gray-800 mt-3">
                    ₹{doctor.consultationFee}
                  </p>

                  <button
                    type="button"
                    onClick={() => handleSelectDoctor(doctor)}
                    className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
                  >
                    Select Doctor
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;
