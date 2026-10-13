import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import FAQ from "./FAQ";

describe("FAQ Component", () => {
  it("displays FAQ questions", () => {
    render(<FAQ />);

    expect(
      screen.getByText("How can I book an appointment?")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Can I cancel my appointment?")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Can I upload my medical reports?")
    ).toBeInTheDocument();
  });

  it("opens and closes an FAQ answer", () => {
    render(<FAQ />);

    const question = screen.getByRole("button", {
      name: /How can I book an appointment?/i,
    });

    fireEvent.click(question);

    expect(
      screen.getByText(
        /Login to your account, go to Book Appointment/i
      )
    ).toBeInTheDocument();

    fireEvent.click(question);

    expect(
      screen.queryByText(
        /Login to your account, go to Book Appointment/i
      )
    ).not.toBeInTheDocument();
  });
});