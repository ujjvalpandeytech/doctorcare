import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import BookAppointment from "./BookAppointment";

const mockDispatch = vi.fn();
const mockPost = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      doctor: {
        doctors: [
          {
            _id: "doctor1",
            name: "Dr. Sharma",
            specialization: "Cardiologist",
            qualification: "MBBS, MD",
            experience: 10,
            consultationFee: 800,
            availableTime: "10:00 AM - 2:00 PM",
            availableDays: ["Monday", "Wednesday"],
          },
        ],
        loading: false,
        error: null,
      },
    }),
}));

vi.mock("../redux/slices/doctorSlice", () => ({
  getDoctors: vi.fn(() => ({
    type: "doctors/getDoctors",
  })),
}));

vi.mock("../services/api", () => ({
  default: {
    post: (...args) => mockPost(...args),
  },
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../components/DashboardLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

describe("Book Appointment Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays available doctors", () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Dr. Sharma")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cardiologist")
    ).toBeInTheDocument();

    expect(
      screen.getByText("MBBS, MD")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Select Doctor",
      })
    ).toBeInTheDocument();
  });

  it("shows appointment form after selecting a doctor", () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Select Doctor",
      })
    );

    expect(
      screen.getByText("Selected Doctor")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Appointment Details")
    ).toBeInTheDocument();

    expect(
      document.querySelector(
        'input[name="appointmentDate"]'
      )
    ).toBeInTheDocument();

    expect(
      document.querySelector(
        'input[name="appointmentTime"]'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Book Appointment",
      })
    ).toBeInTheDocument();
  });

  it("does not submit when appointment date is missing", () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Select Doctor",
      })
    );

    const timeInput = document.querySelector(
      'input[name="appointmentTime"]'
    );

    fireEvent.change(timeInput, {
      target: {
        name: "appointmentTime",
        value: "11:00",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Book Appointment",
      })
    );

    expect(mockPost).not.toHaveBeenCalled();
  });

  it("does not submit when selected time is outside doctor availability", () => {
    render(
      <MemoryRouter>
        <BookAppointment />
      </MemoryRouter>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Select Doctor",
      })
    );

    const dateInput = document.querySelector(
      'input[name="appointmentDate"]'
    );

    const timeInput = document.querySelector(
      'input[name="appointmentTime"]'
    );

    fireEvent.change(dateInput, {
      target: {
        name: "appointmentDate",
        value: "2099-01-05",
      },
    });

    fireEvent.change(timeInput, {
      target: {
        name: "appointmentTime",
        value: "16:00",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Book Appointment",
      })
    );

    expect(mockPost).not.toHaveBeenCalled();
  });
});