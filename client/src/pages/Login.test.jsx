import { render, screen } from "@testing-library/react";
import { describe, it, expect,} from "vitest";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import Login from "./Login"
import authReducer from "../redux/slices/authSlice";

const renderLogin = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );
};

describe("Login Page", () => {
  it("renders login form correctly", () => {
    renderLogin();

    expect(
      screen.getByRole("heading", { name: /doctorcare/i })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(/enter password/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("shows validation error when form is empty", async () => {
    const user = userEvent.setup();

    renderLogin();

    const loginButton = screen.getByRole("button", {
      name: /login/i,
    });

    await user.click(loginButton);

    expect(
      await screen.findByText(/email is required/i)
    ).toBeInTheDocument();

    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();
  });

  it("shows error for invalid email", async () => {
    const user = userEvent.setup();

    renderLogin();

    await user.type(
      screen.getByPlaceholderText(/enter your email/i),
      "wrong-email"
    );

    await user.type(
      screen.getByPlaceholderText(/enter password/i),
      "123456"
    );

    await user.click(
      screen.getByRole("button", {
        name: /login/i,
      })
    );

    expect(
      await screen.findByText(/email/i)
    ).toBeInTheDocument();
  });

  it("allows user to enter email and password", async () => {
    const user = userEvent.setup();

    renderLogin();

    const emailInput =
      screen.getByPlaceholderText(/enter your email/i);

    const passwordInput =
      screen.getByPlaceholderText(/password/i);

    await user.type(
      emailInput,
      "test@example.com"
    );

    await user.type(
      passwordInput,
      "123456"
    );

    expect(emailInput).toHaveValue(
      "test@example.com"
    );

    expect(passwordInput).toHaveValue(
      "123456"
    );
  });
});