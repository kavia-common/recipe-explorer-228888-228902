import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders header navigation and default route (Feed)", () => {
  render(<App />);

  expect(screen.getByText("Recipe Explorer")).toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();

  expect(screen.getByRole("heading", { name: /feed/i })).toBeInTheDocument();
});
