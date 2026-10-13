import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCamera, FaArrowLeft, FaSave } from "react-icons/fa";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import DashboardLayout from "../components/DashboardLayout"
import { updateProfileImage } from "../redux/slices/authSlice";

import {
  getProfile,
  updateProfile,
  uploadProfileImage,
  clearProfileMessages,
} from "../redux/slices/profileSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const {
    user,
    loading,
    updating,
    uploading,
    error,
    success,
  } = useSelector((state) => state.profile);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth
          ? user.dateOfBirth.split("T")[0]
          : "",
        gender: user.gender || "",
        address: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
  if (error) {
    const message =
      typeof error === "string"
        ? error
        : error?.message || "Something went wrong";

    toast.error(message);
    dispatch(clearProfileMessages());
  }
}, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Profile updated successfully");
      dispatch(clearProfileMessages());
    }
  }, [success, dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    dispatch(updateProfile(formData));
  };

 const handleImageChange = async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  try {
    const imagePath = await dispatch(
      uploadProfileImage(file)
    ).unwrap();

    dispatch(updateProfileImage(imagePath));

    toast.success("Profile picture updated successfully");
 } catch (error) {
  const message =
    typeof error === "string"
      ? error
      : error?.message || "Failed to upload profile picture";

  toast.error(message);
}
};

  const imageUrl = user?.profileImage
    ? `http://localhost:5000${user.profileImage}`
    : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-blue-600 font-semibold">
            Loading profile...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
          >
            <FaArrowLeft />
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              My Profile
            </h1>

            <p className="text-gray-500 mt-1">
              View and update your personal information
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          {/* Profile image section */}
          <div className="bg-blue-50 p-8 flex flex-col items-center">

            <div className="relative">

              <div className="w-32 h-32 rounded-full overflow-hidden bg-blue-100 border-4 border-white shadow-md flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-blue-600">
                    {user?.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                )}

              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-md transition disabled:opacity-50"
              >
                <FaCamera />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.jfif,.png,.webp"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {user?.name || "Patient"}
            </h2>

            <p className="text-sm text-gray-500">
              {uploading
                ? "Uploading photo..."
                : "Click the camera icon to change your photo"}
            </p>
          </div>

          {/* Profile form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8"
          >

            <h2 className="text-xl font-bold text-gray-800 mb-6">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="10"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* DOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>

                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your address"
                />
              </div>

            </div>

            {/* Save */}
            <div className="mt-8 flex justify-end">

              <button
                type="submit"
                disabled={updating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <FaSave />

                {updating ? "Saving..." : "Save Changes"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;