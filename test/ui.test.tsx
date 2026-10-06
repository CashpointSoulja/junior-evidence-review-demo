import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/ui/App";
import { STORAGE_KEY } from "../src/engine/store";

function setHash(h: string) {
  act(() => {
    window.location.hash = h;
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  });
}

describe("app UI", () => {
  it("shows the literal logo top-left, non-affiliation footer and synthetic labels", () => {
    render(<App />);
    const logo = screen.getByAltText("Junior") as HTMLImageElement;
    expect(logo.getAttribute("src")).toBe("/brand/junior-logo.svg");
    expect(screen.getByText("Independent concept by Ayo Ahmed, not affiliated with Junior AI.")).toBeInTheDocument();
    expect(screen.getByText(/Synthetic demo data/)).toBeInTheDocument();
    expect(screen.getAllByText("Blocked").length).toBeGreaterThan(0);
  });

  it("opens a transcript at the cited quote when a source is clicked, and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<App />);
    setHash("#/claims/CL-3");
    await user.click(screen.getAllByRole("button", { name: /Open source QA-04/ })[0]);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("heading", { name: /Source QA-04/ })).toHaveFocus();
    expect(dialog.querySelector("#quote-QA-04")).toHaveAttribute("aria-current", "true");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("resolves the deep link format used in exports", () => {
    render(<App />);
    setHash("#/source/QC-03");
    expect(document.querySelector("#quote-QC-03")).toHaveAttribute("aria-current", "true");
  });

  it("supports a keyboard-only review decision", async () => {
    const user = userEvent.setup();
    render(<App />);
    setHash("#/claims/CL-1");
    const radio = screen.getByRole("radio", { name: "Supported" });
    radio.focus();
    await user.keyboard(" ");
    await user.tab();
    await user.tab();
    expect(screen.getByRole("button", { name: "Save decision" })).toHaveFocus();
    await user.keyboard("{Enter}");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.claims[0].review.status).toBe("supported");
  });

  it("renders XSS payloads as text, not markup", async () => {
    const user = userEvent.setup();
    render(<App />);
    setHash("#/claims/CL-9");
    await user.click(screen.getByText("Edit claim"));
    const ta = screen.getByLabelText("Claim text");
    await user.clear(ta);
    await user.type(ta, "<img src=x onerror=alert(1)>");
    await user.click(screen.getByRole("button", { name: "Save new version" }));
    expect(document.querySelector("img[src='x']")).toBeNull();
    expect(screen.getAllByText("<img src=x onerror=alert(1)>").length).toBeGreaterThan(0);
  });

  it("keeps state across a remount (refresh) and resets on confirm", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    setHash("#/claims/CL-1");
    await user.click(screen.getByRole("button", { name: "Save decision" }));
    unmount();
    render(<App />);
    expect(screen.getByText("Restored your review from this browser.")).toBeInTheDocument();
    expect(screen.getAllByText("Supported").length).toBeGreaterThan(1);
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: "Reset" }));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).claims[0].review.status).toBe("unreviewed");
  });

  it("needs a human preview and acknowledgement before export", async () => {
    const user = userEvent.setup();
    render(<App />);
    setHash("#/export");
    expect(screen.queryByRole("button", { name: "Download .md" })).toBeNull();
    await user.click(screen.getByRole("checkbox", { name: /Helena Marsh/ }));
    await user.click(screen.getByRole("button", { name: "Show preview" }));
    const preview = screen.getByLabelText("Export preview");
    expect(preview.textContent).toContain("SYNTHETIC DEMO DATA");
    expect(preview.textContent).not.toContain("Helena Marsh");
    expect(screen.getByRole("button", { name: "Download .md" })).toBeDisabled();
    await user.click(screen.getByRole("checkbox", { name: /I have read the preview/ }));
    expect(screen.getByRole("button", { name: "Download .md" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Approve as handoff-ready" })).toBeDisabled();
  });
});
