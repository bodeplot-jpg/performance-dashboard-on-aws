import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BackendService from "../../services/BackendService";
import StorageService from "../../services/StorageService";
import EditTable from "../EditTable";

jest.mock("../../services/BackendService");
jest.mock("../../services/StorageService");
jest.mock("papaparse");
jest.mock("../../hooks");

beforeEach(() => {
  BackendService.editWidget = jest.fn();
  StorageService.uploadDataset = jest.fn().mockReturnValue({
    s3Keys: {
      raw: "abc.csv",
      json: "abc.json",
    },
  });
  StorageService.downloadFile = jest.fn();
});

test("renders title", async () => {
  render(<EditTable />, { wrapper: MemoryRouter });
  expect(
    await screen.findByRole("heading", { name: "Edit table" })
  ).toBeInTheDocument();
});

test("renders a textfield for table title", async () => {
  render(<EditTable />, { wrapper: MemoryRouter });
  expect(await screen.findByLabelText("Table title*")).toBeInTheDocument();
});

test("renders a file upload input", async () => {
  render(<EditTable />, { wrapper: MemoryRouter });
  const radioButton = await screen.getByTestId("staticDatasetRadioButton");
  fireEvent.click(radioButton);
  expect(await screen.findByLabelText("Static datasets*")).toBeInTheDocument();
});
