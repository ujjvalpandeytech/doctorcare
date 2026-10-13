import {
  FaBars,
  FaCalendarPlus,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const DashboardHeader = ({ onMenuClick }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-600 hover:text-blue-600"
        >
          <FaBars size={22} />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            Patient Dashboard
          </h1>

          <p className="hidden sm:block text-sm text-gray-500">
            Manage your healthcare appointments
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/book-appointment"
          className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg transition"
        >
          <FaCalendarPlus />
          Book Appointment
        </Link>

        <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
  {user?.profileImage ? (
    <img
      src={user.profileImage}
      alt={user.name || "Profile"}
      className="w-full h-full object-cover"
    />
  ) : (
    user?.name?.charAt(0)?.toUpperCase() || "P"
  )}
</div>


      </div>
    </header>
  );
};

export default DashboardHeader;