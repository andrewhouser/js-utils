import { afterEach } from "vitest";
import "@testing-library/jest-dom";

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  document.body.innerHTML = "";
});
