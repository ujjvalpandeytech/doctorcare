import {
  FaCalendarPlus,
  FaCalendarCheck,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "Book Appointment",
      description: "Schedule an appointment with a doctor",
      icon: <FaCalendarPlus />,
      path: "/book-appointment",
    },
    {
      title: "My Appointments",
      description: "View and manage your appointments",
      icon: <FaCalendarCheck />,
      path: "/appointments",
    },
    {
      title: "My Profile",
      description: "View and update your personal information",
      icon: <FaUser />,
      path: "/profile",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {actions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition duration-300"
          >
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition">
              {action.icon}
            </div>

            <h3 className="font-semibold text-gray-800 mt-4">
              {action.title}
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              {action.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;