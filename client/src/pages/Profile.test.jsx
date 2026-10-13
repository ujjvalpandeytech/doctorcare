import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Profile from "./Profile"

const mockDispatch = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,

  useSelector: (selector) =>
    selector({
      profile: {
        user: {
          name: "Ujjval Pandey",
          email: "ujjval@example.com",
          phone: "9876543210",
          profileImage: "",
          dateOfBirth: "2002-01-15",
          gender: "Male",
          address: "Rewa, Madhya Pradesh",
        },
        loading: false,
        updating: false,
        uploading: false,
        error: null,
        success: false,
      },
    }),
}));

vi.mock("../redux/slices/profileSlice", () => ({
  getProfile: vi.fn(() => ({
    type: "profile/getProfile",
  })),

  updateProfile: vi.fn((data) => ({
    type: "profile/updateProfile",
    payload: data,
  })),

  uploadProfileImage: vi.fn((file) => ({
    type: "profile/uploadProfileImage",
    payload: file,
  })),

  clearProfileMessages: vi.fn(() => ({
    type: "profile/clearProfileMessages",
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

describe("Profile Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });
  });

  it("renders user profile information", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Ujjval Pandey")).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("ujjval@example.com")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("9876543210")
    ).toBeInTheDocument();
  });

  it("displays profile fields", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByText("Gender")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Rewa, Madhya Pradesh")
    ).toBeInTheDocument();
  });

  it("allows the user to edit profile information", () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const nameInput = screen.getByDisplayValue("Ujjval Pandey");

    fireEvent.change(nameInput, {
      target: {
        value: "Ujjval Kumar",
      },
    });

    expect(nameInput).toHaveValue("Ujjval Kumar");
  });

  it("dispatches updateProfile when the profile form is submitted", async () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    const nameInput = screen.getByDisplayValue("Ujjval Pandey");

    fireEvent.change(nameInput, {
      target: {
        value: "Ujjval Kumar",
      },
    });

    const updateButton = screen.getByRole("button", {
      name: /update profile|save changes|save/i,
    });

    fireEvent.click(updateButton);

    expect(mockDispatch).toHaveBeenCalled();
  });
});