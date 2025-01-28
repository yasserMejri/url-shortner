import React from "react";
import App from "./App";
import { render, screen, fireEvent } from "@testing-library/react";
import { getShortnedUrl } from "./service";

jest.mock("./service");

test("renders the input and button", () => {
  render(<App />);
  const urlInputElement = screen.getByTestId("url-input");
  const shortenedUrlInputElement = screen.getByTestId("shortened-url");
  const buttonElement = screen.getByTestId("shorten-button");
  expect(urlInputElement).toBeInTheDocument();
  expect(shortenedUrlInputElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});

test("shows error message for invalid URL", async () => {
  render(<App />);
  const urlInputElement = screen.getByTestId("url-input");
  const buttonElement = screen.getByTestId("shorten-button");

  fireEvent.change(urlInputElement, { target: { value: "invalid-url" } });
  fireEvent.click(buttonElement);

  const errorMessage = await screen.findByTestId("error-message");
  expect(errorMessage).toBeInTheDocument();
});

test("shows shortened URL on success", async () => {
  getShortnedUrl.mockResolvedValue({ shortKey: "abc123" });

  render(<App />);
  const urlInputElement = screen.getByTestId("url-input");
  const buttonElement = screen.getByTestId("shorten-button");

  fireEvent.change(urlInputElement, {
    target: { value: "http://example.com" },
  });
  fireEvent.click(buttonElement);

  const shortenedUrlInputElement = await screen.findByDisplayValue("abc123");
  expect(shortenedUrlInputElement).toBeInTheDocument();
  expect(shortenedUrlInputElement).toHaveAttribute(
    "data-testid",
    "shortened-url"
  );
});

test("shows error message on failure", async () => {
  getShortnedUrl.mockRejectedValue(new Error("Failed to shorten URL"));

  render(<App />);
  const urlInputElement = screen.getByTestId("url-input");
  const buttonElement = screen.getByTestId("shorten-button");

  fireEvent.change(urlInputElement, {
    target: { value: "http://example.com" },
  });
  fireEvent.click(buttonElement);

  const errorMessage = await screen.findByTestId("error-message");
  expect(errorMessage).toBeInTheDocument();
});
