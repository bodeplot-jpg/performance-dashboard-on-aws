import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditLogo from "../EditLogo";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.updateSetting = jest.fn();
  StorageService.downloadLogo = jest.fn();
  window.URL.createObjectURL = jest.fn();
});

test("renders title", async () => {
  render(<EditLogo />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("heading", { name: "Edit logo" })
  ).toBeInTheDocument();
});

test("renders page description", async () => {
  const { getByText } = render(<EditLogo />, { wrapper: MemoryRouter });
  expect(
    getByText(
      "This logo will appear in the header next to the performance dashboard name and in the published site header."
    )
  ).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<EditLogo />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("File upload*")).toBeInTheDocument();
});

test("renders file upload description constraint", async () => {
  const { getByText } = render(<EditLogo />, { wrapper: MemoryRouter });
  expect(getByText("Must be a PNG, JPEG, or SVG file")).toBeInTheDocument();
});

test("renders a alt text input", async () => {
  render(<EditLogo />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Logo alt text*")).toBeInTheDocument();
});

test("renders alt text description constraint", async () => {
  const { getByText } = render(<EditLogo />, { wrapper: MemoryRouter });
  expect(
    getByText(
      "Provide a short description of the logo for users with visual impairments using a screen reader. This description will not display on the dashboard."
    )
  ).toBeInTheDocument();
});

test("on submit, it calls updateSetting and upload logo", async () => {
  const { getByRole, getByLabelText } = render(<EditLogo />, {
    wrapper: MemoryRouter,
  });

  const submitButton = getByRole("button", { name: "Save" });

  fireEvent.change(getByLabelText("File upload*"), {
    target: {
      files: ["image.jpg"],
    },
  });
  fireEvent.change(getByLabelText("Logo alt text*"), {
    target: {
      value: "Alt text",
    },
  });

  await act(async () => {
    fireEvent.click(submitButton);
  });

  expect(BackendService.updateSetting).toHaveBeenCalled();
  expect(StorageService.uploadLogo).toHaveBeenCalled();
});
