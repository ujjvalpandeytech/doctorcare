import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaUserMd,
  FaArrowRight,
} from "react-icons/fa";

import DashboardLayout from "../components/DashboardLayout";
import WelcomeCard from "../components/WelcomeCard";
import QuickActions from "../components/QuickActions";
import MedicalCarousel from "../components/dashboard/MedicalCarousel";
import { getMyAppointments } from "../redux/slices/appointmentSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { appointments, loading } = useSelector(
    (state) => state.appointments
  );

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  // Find the nearest upcoming appointment
  const upcomingAppointment = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(
        appointment.appointmentDate
      );

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return (
        appointmentDate >= today &&
        appointment.status !== "Cancelled" &&
        appointment.status !== "Completed"
      );
    })
    .sort(
      (a, b) =>
        new Date(a.appointmentDate) -
        new Date(b.appointmentDate)
    )[0];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeCard />

        <MedicalCarousel />

        <QuickActions />

        {/* Upcoming Appointment */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Upcoming Appointment
            </h2>

            <Link
              to="/appointments"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
            >
              View All
              <FaArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-blue-600 font-medium">
                Loading appointment...
              </p>
            </div>
          ) : upcomingAppointment ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                
                {/* Doctor */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                    <FaUserMd />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {upcomingAppointment.doctor?.name ||
                        "Doctor"}
                    </h3>

                    <p className="text-blue-600 font-medium">
                      {upcomingAppointment.doctor
                        ?.specialization ||
                        upcomingAppointment.doctorType}
                    </p>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="flex flex-col sm:flex-row gap-5">
                  <div className="flex items-center gap-3">
                    <FaCalendarAlt className="text-blue-600" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Date
                      </p>

                      <p className="font-medium text-gray-800">
                        {formatDate(
                          upcomingAppointment.appointmentDate
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaClock className="text-blue-600" />

                    <div>
                      <p className="text-xs text-gray-500">
                        Time
                      </p>

                      <p className="font-medium text-gray-800">
                        {upcomingAppointment.appointmentTime}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      upcomingAppointment.status ===
                      "Confirmed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {upcomingAppointment.status ||
                      "Pending"}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <p className="text-gray-500">
                You don't have any upcoming appointments.
              </p>

              <Link
                to="/book-appointment"
                className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition"
              >
                Book an Appointment
              </Link>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;