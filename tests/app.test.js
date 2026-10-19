const fs = require("fs");
const path = require("path");

describe("React Frontend Core Asset Validation", () => {
  const frontendDir = path.join(__dirname, "../frontend");

  test("frontend folder and package.json exist", () => {
    const pkgPath = path.join(frontendDir, "package.json");
    expect(fs.existsSync(pkgPath)).toBe(true);

    const pkgContent = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    expect(pkgContent.dependencies).toHaveProperty("react");
    expect(pkgContent.dependencies).toHaveProperty("react-router-dom");
  });

  test("public/index.html exists and contains root div", () => {
    const htmlPath = path.join(frontendDir, "public/index.html");
    expect(fs.existsSync(htmlPath)).toBe(true);

    const content = fs.readFileSync(htmlPath, "utf8");
    expect(content).toMatch(/<div id="root"><\/div>/i);
  });

  test("React entry point and styling exist", () => {
    const indexJs = path.join(frontendDir, "src/index.js");
    const appJs = path.join(frontendDir, "src/App.js");
    const appCss = path.join(frontendDir, "src/App.css");

    expect(fs.existsSync(indexJs)).toBe(true);
    expect(fs.existsSync(appJs)).toBe(true);
    expect(fs.existsSync(appCss)).toBe(true);
  });

  test("React pages (PlanTrip and Dashboard) exist and contain JSX logic", () => {
    const planTrip = path.join(frontendDir, "src/pages/PlanTrip.jsx");
    const dashboard = path.join(frontendDir, "src/pages/Dashboard.jsx");

    expect(fs.existsSync(planTrip)).toBe(true);
    expect(fs.existsSync(dashboard)).toBe(true);

    const planContent = fs.readFileSync(planTrip, "utf8");
    const dashContent = fs.readFileSync(dashboard, "utf8");

    expect(planContent).toMatch(/PlanTrip/i);
    expect(dashContent).toMatch(/Dashboard/i);
  });

  test("React modal component exists and has rating dropdown logic", () => {
    const modalPath = path.join(frontendDir, "src/components/AddActivityModal.jsx");
    expect(fs.existsSync(modalPath)).toBe(true);

    const modalContent = fs.readFileSync(modalPath, "utf8");
    expect(modalContent).toMatch(/AddActivityModal/i);
    expect(modalContent).toMatch(/select id="rating"/i);
  });
});