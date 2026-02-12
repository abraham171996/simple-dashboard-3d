import {
  render,
  screen,
  waitFor,
  cleanup,
} from "@testing-library/react";
import { test, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
vi.mock("../app/store", () => ({
  useAppStore: (selector: any) =>
    selector({
      addDesigner: vi.fn().mockResolvedValue(undefined),
    }),
}));

import DesignerForm from "./DesignerForm";

afterEach(() => {
  cleanup();
});

test("shows validation error if full name is too short", async () => {
  render(<DesignerForm onDone={() => {}} />);

  await userEvent.type(
    screen.getByRole("textbox", { name: /full name/i }),
    "ab",
  );

  await userEvent.click(screen.getByRole("button", { name: /save/i }));

  expect(
    await screen.findByText("Full name must be at least 3 chars"),
  ).toBeInTheDocument();
});

test("calls onDone after successful submit", async () => {
  const onDoneMock = vi.fn();

  render(<DesignerForm onDone={onDoneMock} />);

  await userEvent.type(
    screen.getByRole("textbox", { name: /full name/i }),
    "John Doe",
  );

  const hoursInput = screen.getByRole("spinbutton", {
    name: /working hours/i,
  });

  await userEvent.clear(hoursInput);
  await userEvent.type(hoursInput, "8");

  await userEvent.click(screen.getByRole("button", { name: /save/i }));

  await waitFor(() => {
    expect(onDoneMock).toHaveBeenCalledTimes(1);
  });
});
