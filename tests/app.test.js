const fs = require("fs");
const path = require("path");

describe("Frontend Core Asset Validation", () => {
  test("dashboard.html exists and is not empty", () => {
    const file = path.join(__dirname, "../dashboard.html");
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, "utf8");
    expect(content.length).toBeGreaterThan(0);
  });

  test("plan.html exists and contains HTML markup", () => {
    const file = path.join(__dirname, "../plan.html");
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, "utf8");
    expect(content).toMatch(/<html|<!DOCTYPE/i);
  });

  test("script.js exists", () => {
    const file = path.join(__dirname, "../script.js");
    expect(fs.existsSync(file)).toBe(true);
  });

  test("styles.css exists and contains styling rules", () => {
    const file = path.join(__dirname, "../styles.css");
    expect(fs.existsSync(file)).toBe(true);
    const content = fs.readFileSync(file, "utf8");
    expect(content.length).toBeGreaterThan(0);
  });
});