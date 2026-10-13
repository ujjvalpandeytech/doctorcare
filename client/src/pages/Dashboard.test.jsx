import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Dashboard from "./Dashboard";

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
            },
            appointmentDate: "2099-11-10T00:00:00.000Z",
            appointmentTime: "11:00",
            doctorType: "Cardiology",
            status: "Confirmed",
          },
        ],
        loading: false,
      },
    }),
}));

vi.mock("../redux/slices/appointmentSlice", () => ({
  getMyAppointments: vi.fn(() => ({
    type: "appointments/getMyAppointments",
  })),
}));

vi.mock("../components/DashboardLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../components/WelcomeCard", () => ({
  default: () => (
    <div>
      <h1>Welcome to DoctorCare</h1>
    </div>
  ),
}));

vi.mock("../components/QuickActions", () => ({
  default: () => (
    <div>
      <h2>Quick Actions</h2>
      <a href="/book-appointment">Book Appointment</a>
      <a href="/appointments">My Appointments</a>
    </div>
  ),
}));

vi.mock("../components/dashboard/MedicalCarousel", () => ({
  default: () => (
    <div>
      <h2>Medical Services</h2>
    </div>
  ),
}));

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // TEST 1
  it("renders the dashboard content", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Welcome to DoctorCare")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Quick Actions")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Medical Services")
    ).toBeInTheDocument();
  });

  // TEST 2
  it("dispatches getMyAppointments when dashboard loads", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(mockDispatch).toHaveBeenCalled();
  });

  // TEST 3
  it("displays the upcoming appointment", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Upcoming Appointment")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Dr. Sharma")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cardiologist")
    ).toBeInTheDocument();

    expect(
      screen.getByText("11:00")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Confirmed")
    ).toBeInTheDocument();
  });

  // TEST 4
  it("shows links for appointments", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link", {
        name: /View All/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: /Book Appointment/i,
      })
    ).toBeInTheDocument();
  });
});