import { useSelector } from "react-redux";

const WelcomeCard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="bg-blue-600 rounded-2xl p-6 sm:p-8 text-white">
      <p className="text-blue-100 text-sm">
        Welcome back
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold mt-2">
        Hello, {user?.name || "Patient"} 👋
      </h2>

      <p className="mt-3 text-blue-100 max-w-xl">
        Manage your appointments, view your profile,
        and take control of your healthcare journey.
      </p>
    </div>
  );
};

export default WelcomeCard;