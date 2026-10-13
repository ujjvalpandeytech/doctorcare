import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import Signup from "./Signup";
import authReducer from "../redux/slices/authSlice";

const renderSignup = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </Provider>
  );
};

describe("Signup Page", () => {
  it("renders signup form correctly", () => {
    renderSignup();

    expect(
      screen.getByRole("heading", {
        name: "DoctorCare",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your name")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter your email")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("10-digit phone number")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter password")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Confirm your password")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create Account",
      })
    ).toBeInTheDocument();
  });

  it("shows validation errors when form is empty", async () => {
    const user = userEvent.setup();

    renderSignup();

    const button = screen.getByRole("button", {
      name: "Create Account",
    });

    await user.click(button);

    expect(
      screen.getByText("Name is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Phone number is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Password is required")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please confirm your password")
    ).toBeInTheDocument();
  });

  it("shows error for invalid phone number", async () => {
    const user = userEvent.setup();

    renderSignup();

    await user.type(
      screen.getByPlaceholderText("Enter your name"),
      "Ujjval"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "ujjval@gmail.com"
    );

    await user.type(
      screen.getByPlaceholderText("10-digit phone number"),
      "12345"
    );

    await user.type(
      screen.getByPlaceholderText("Enter password"),
      "123456"
    );

    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "123456"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create Account",
      })
    );

    expect(
      screen.getByText(
        "Enter a valid 10-digit phone number"
      )
    ).toBeInTheDocument();
  });

  it("shows error when passwords do not match", async () => {
    const user = userEvent.setup();

    renderSignup();

    await user.type(
      screen.getByPlaceholderText("Enter your name"),
      "Ujjval"
    );

    await user.type(
      screen.getByPlaceholderText("Enter your email"),
      "ujjval@gmail.com"
    );

    await user.type(
      screen.getByPlaceholderText("10-digit phone number"),
      "9876543210"
    );

    await user.type(
      screen.getByPlaceholderText("Enter password"),
      "123456"
    );

    await user.type(
      screen.getByPlaceholderText("Confirm your password"),
      "1234567"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Create Account",
      })
    );

    expect(
      screen.getByText("Passwords do not match")
    ).toBeInTheDocument();
  });
});