import {
  FaUser,
  FaCalendarCheck,
  FaStethoscope,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navItems = [
    {
      name: "My Profile",
      path: "/profile",
      icon: <FaUser />,
    },
    {
      name: "My Appointments",
      path: "/appointments",
      icon: <FaCalendarCheck />,
    },
    {
      name: "Services",
      path: "/services",
      icon: <FaStethoscope />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-200 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Mobile close button */}
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 pb-8">
          <h1 className="text-2xl font-bold text-blue-600">DoctorCare</h1>

          <p className="text-sm text-gray-500 mt-1">Patient Portal</p>
        </div>

        {/* Patient information */}
        <div className="mx-4 mb-6 p-4 bg-blue-50 rounded-xl">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
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

          <h2 className="mt-3 font-semibold text-gray-800">
            {user?.name || "Patient"}
          </h2>

          <p className="text-sm text-gray-500">Patient</p>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                ` flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
