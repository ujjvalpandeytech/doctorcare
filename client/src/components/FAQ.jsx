import { useState } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = [
  {
    question: "How can I book an appointment?",
    answer:
      "Login to your account, go to Book Appointment, select a doctor, choose an available date and time, and submit your appointment request.",
  },
  {
    question: "Can I cancel my appointment?",
    answer:
      "Yes. You can cancel your pending or confirmed appointment from the My Appointments section.",
  },
  {
    question: "Can I upload my medical reports?",
    answer:
      "Yes. You can upload JPG, PNG, WEBP, or PDF medical reports while booking an appointment. The maximum file size is 5 MB.",
  },
  {
    question: "How do I view my appointments?",
    answer:
      "After logging in, open My Appointments from the dashboard. You can also filter your appointments by year.",
  },
  {
    question: "Can I choose a specific doctor?",
    answer:
      "Yes. On the Book Appointment page, you can view available doctors and select the doctor you want to consult.",
  },
  {
    question: "What happens after I book an appointment?",
    answer:
      "Your appointment is saved with a Pending status. You can view its details from My Appointments.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="mt-12 ">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Frequently Asked Questions
        </h2>

        <p className="text-gray-500 mt-2">
          Find answers to common questions about our services.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {faqData.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => handleToggle(index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-gray-800">
                  {faq.question}
                </span>

                <span className="text-blue-600 shrink-0">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default FAQ;