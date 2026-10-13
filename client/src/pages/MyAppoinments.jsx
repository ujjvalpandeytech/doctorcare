import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaStethoscope,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../components/DashboardLayout";
import {
  getMyAppointments,
  cancelAppointment,
} from "../redux/slices/appointmentSlice";

const MyAppointments = () => {
  const dispatch = useDispatch();

  const { appointments, loading, error } = useSelector(
    (state) => state.appointments,
  );

  const [selectedYear, setSelectedYear] = useState("");

  useEffect(() => {
    dispatch(getMyAppointments(selectedYear));
  }, [dispatch, selectedYear]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Generate years for dropdown
  const currentYear = new Date().getFullYear();

  const years = [];

  for (let year = currentYear; year >= currentYear - 5; year--) {
    years.push(year);
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const handleCancelAppointment = (appointmentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?",
    );

    if (!confirmed) {
      return;
    }

    dispatch(cancelAppointment(appointmentId))
      .unwrap()
      .then((result) => {
        toast.success("Appointment cancelled successfully");
      })
      .catch((error) => {
        toast.error(error || "Failed to cancel appointment");
      });
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
            >
              <FaArrowLeft />
            </Link>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                My Appointments
              </h1>

              <p className="text-gray-500 mt-1">
                View and manage your doctor appointments
              </p>
            </div>
          </div>

          {/* YEAR FILTER */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Year
            </label>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full sm:w-40 px-4 py-3 bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Years</option>

              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-blue-600 font-semibold">
              Loading appointments...
            </p>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && appointments.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <FaCalendarAlt />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              No Appointments Found
            </h2>

            <p className="text-gray-500 mt-2">
              {selectedYear
                ? ` You don't have any appointments in ${selectedYear}`
                : "You don't have any appointments yet."}
            </p>

            <Link
              to="/book-appointment"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Book an Appointment
            </Link>
          </div>
        )}

        {/* APPOINTMENT LIST */}
        {!loading && appointments.length > 0 && (
          <div className="space-y-6">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-md transition"
              >
                {/* DOCTOR */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
                      <FaUserMd />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-gray-800">
                        {appointment.doctor?.name}
                      </h2>

                      <p className="text-blue-600 font-medium mt-1">
                        {appointment.doctor?.specialization}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {appointment.doctor?.qualification}
                      </p>
                    </div>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`self-start px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : appointment.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : appointment.status === "Completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.status || "Pending"}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-7 pt-6 border-t border-gray-100">
                  {/* DATE */}
                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="text-blue-600 mt-1" />

                    <div>
                      <p className="text-sm text-gray-500">Date</p>

                      <p className="font-medium text-gray-800 mt-1">
                        {formatDate(appointment.appointmentDate)}
                      </p>
                    </div>
                  </div>

                  {/* TIME */}
                  <div className="flex items-start gap-3">
                    <FaClock className="text-blue-600 mt-1" />

                    <div>
                      <p className="text-sm text-gray-500">Time</p>

                      <p className="font-medium text-gray-800 mt-1">
                        {appointment.appointmentTime}
                      </p>
                    </div>
                  </div>

                  {/* DOCTOR TYPE */}
                  <div className="flex items-start gap-3">
                    <FaStethoscope className="text-blue-600 mt-1" />

                    <div>
                      <p className="text-sm text-gray-500">Doctor Type</p>

                      <p className="font-medium text-gray-800 mt-1">
                        {appointment.doctorType}
                      </p>
                    </div>
                  </div>
                </div>

                {/* COMMENTS */}
                {/* COMMENTS */}
                {appointment.comments && (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Comments</p>

                    <p className="text-gray-700 mt-2">{appointment.comments}</p>
                  </div>
                )}

                {/* MEDICAL REPORT */}
                {appointment.report && (
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-sm text-gray-500 mb-3">Medical Report</p>

                    <a
                      href={appointment.report}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition"
                    >
                      📄 View Medical Report
                    </a>
                  </div>
                )}

                {(appointment.status === "Pending" ||
                  appointment.status === "Confirmed") && (
                  <div className="mt-6 pt-5 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="inline-flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
                    >
                      <FaTimes />
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyAppointments;
