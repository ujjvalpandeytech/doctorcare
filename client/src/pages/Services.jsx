import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaUserMd,
  FaHeart,
  FaAllergies,
  FaBone,
  FaFemale,
  FaMicroscope,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import DashboardLayout from "../components/DashboardLayout";
import { getServices } from "../redux/slices/serviceSlice";
import FAQ from "../components/FAQ";

const iconMap = {
  FaUserMd: <FaUserMd />,
  FaHeart: <FaHeart />,
  FaAllergies: <FaAllergies />,
  FaBone: <FaBone />,
  FaFemale: <FaFemale />,
  FaMicroscope: <FaMicroscope />,
};

const Services = () => {
  const dispatch = useDispatch();

  const { services, loading, error } = useSelector(
    (state) => state.services
  );

  useEffect(() => {
    dispatch(getServices());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/dashboard"
            className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-200 transition"
          >
            <FaArrowLeft />
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Our Services
            </h1>

            <p className="text-gray-500 mt-1">
              Explore the healthcare services available at DoctorCare.
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <p className="text-blue-600 font-semibold">
              Loading services...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-5">
            {error}
          </div>
        )}

        {/* Services */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                  {iconMap[service.icon] || <FaUserMd />}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mt-5">
                  {service.name}
                </h2>

                <p className="text-gray-500 mt-3 leading-relaxed">
                  {service.description}
                </p>

                <Link
                  to="/book-appointment"
                  className="inline-block mt-5 text-blue-600 font-medium hover:text-blue-700"
                >
                  Book Appointment →
                </Link>
              </div>
            ))}
          </div>
        )}

        
    {/*FAQ*/}
       <FAQ/>

        {/* Empty state */}
        {!loading && !error && services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">
              No services available at the moment.
            </p>
          </div>
        )}
      </div>



    </DashboardLayout>
  );
  
  
};

export default Services;