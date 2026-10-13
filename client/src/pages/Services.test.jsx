import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Services from "./Services";

const mockDispatch = vi.fn();

let mockServiceState;

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      services: mockServiceState,
    }),
}));

vi.mock("../redux/slices/serviceSlice", () => ({
  getServices: vi.fn(() => ({
    type: "services/getServices",
  })),
}));

vi.mock("../components/DashboardLayout", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../components/FAQ", () => ({
  default: () => <div>FAQ Section</div>,
}));

describe("Services Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockServiceState = {
      services: [
        {
          _id: "service1",
          name: "Cardiology",
          description:
            "Heart and cardiovascular healthcare services.",
          icon: "FaHeart",
        },
        {
          _id: "service2",
          name: "Orthopedics",
          description:
            "Treatment for bones, joints and muscles.",
          icon: "FaBone",
        },
      ],
      loading: false,
      error: null,
    };
  });

  // TEST 1
  it("displays available services", () => {
    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Our Services")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Cardiology")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Orthopedics")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Heart and cardiovascular healthcare services."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Treatment for bones, joints and muscles."
      )
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Book Appointment →")
    ).toHaveLength(2);
  });

  // TEST 2
  it("shows loading state while services are loading", () => {
    mockServiceState = {
      services: [],
      loading: true,
      error: null,
    };

    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Loading services...")
    ).toBeInTheDocument();
  });

  // TEST 3
  it("shows error message when fetching services fails", () => {
    mockServiceState = {
      services: [],
      loading: false,
      error: "Failed to fetch services",
    };

    render(
      <MemoryRouter>
        <Services />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Failed to fetch services")
    ).toBeInTheDocument();
  });
});