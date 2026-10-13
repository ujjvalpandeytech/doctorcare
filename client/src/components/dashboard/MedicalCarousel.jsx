import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCalendarCheck,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Your Health, Our Priority",
    description:
      "Connect with qualified doctors and manage your healthcare appointments easily.",
  },
  {
    title: "Book Your Appointment",
    description:
      "Choose your preferred doctor, select an available time and book your appointment in just a few clicks.",
  },
  {
    title: "Manage Your Healthcare",
    description:
      "Keep track of your appointments, medical reports and healthcare information from one place.",
  },
];

const MedicalCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden rounded-2xl bg-blue-600 text-white min-h-70 sm:min-h-80 flex items-center">
      {/* Content */}
      <div className="px-6 py-10 sm:px-10 sm:py-12 max-w-2xl">
        <span className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm mb-4">
          DoctorCare
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          {slide.title}
        </h2>

        <p className="mt-4 text-blue-50 text-sm sm:text-base leading-relaxed">
          {slide.description}
        </p>

        <button
          type="button"
          onClick={() => navigate("/book-appointment")}
          className="mt-6 inline-flex items-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
        >
          <FaCalendarCheck />
          Book Appointment
        </button>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
      >
        <FaChevronLeft />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
      >
        <FaChevronRight />
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-7 bg-white"
                : "w-2 bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default MedicalCarousel;