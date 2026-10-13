import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MyAppointments from "./MyAppoinments";

const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      appointments: {
        appointments: [
          {
            _id: "appointment1",
            doctor: {
              name: "Dr. Sharma",
              specialization: "Cardiologist",
              qualification: "MBBS, MD",
            },
            appointmentDate: "2026-11-10T00:00:00.000Z",
            appointmentTime: "11:00",
            doctorType: "Cardiology",
            comments: "Regular checkup",
            report: "/uploads/reports/report.pdf",
            status: "Pending",
          },
        ],
        loading: false,
        error: null,
      },
    }),
}));

vi.mock("../redux/slices/appointmentSlice", () => ({
  getMyAppointments: vi.fn((year) => ({
    type: "appointments/getMyAppointments",
    payload: year,
  })),

  cancelAppointment: vi.fn((id) => ({
    type: "appointments/cancelAppointment",
    payload: id,
  })),
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

describe("My Appointments Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.confirm = vi.fn(() => true);

    // Important:
    // dispatch() must return an object containing unwrap()
    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
  });

  // TEST 1
  it("displays appointment details", () => {
    render(
      <MemoryRouter>
        <MyAppointments />
      </MemoryRouter>
    );

    expect(
      screen.getByText("My Appointments")
    ).toBeInTheDocument();

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
      screen.getByText("11:00")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cardiology")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Regular checkup")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Pending")
    ).toBeInTheDocument();
  });

  // TEST 2
  it("shows year filter and dispatches when year changes", () => {
    render(
      <MemoryRouter>
        <MyAppointments />
      </MemoryRouter>
    );

    const yearSelect = screen.getByDisplayValue("All Years");

    expect(yearSelect).toBeInTheDocument();

    fireEvent.change(yearSelect, {
      target: {
        value: "2026",
      },
    });

    expect(mockDispatch).toHaveBeenCalled();
  });

  // TEST 3
  it("shows cancel button for pending appointment", () => {
    render(
      <MemoryRouter>
        <MyAppointments />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /Cancel Appointment/i,
      })
    ).toBeInTheDocument();
  });

  // TEST 4
  it("asks for confirmation before cancelling appointment", () => {
    render(
      <MemoryRouter>
        <MyAppointments />
      </MemoryRouter>
    );

    const cancelButton = screen.getByRole("button", {
      name: /Cancel Appointment/i,
    });

    fireEvent.click(cancelButton);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to cancel this appointment?"
    );
  });
});