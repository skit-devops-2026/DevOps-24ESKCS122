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

describe("M5 Containerization Validation", () => {
  test("Dockerfile exists in repository root", () => {
    const dockerfile = path.join(__dirname, "../Dockerfile");
    expect(fs.existsSync(dockerfile)).toBe(true);
  });

  test("docker-compose.yml exists in repository root", () => {
    const composeFile = path.join(__dirname, "../docker-compose.yml");
    expect(fs.existsSync(composeFile)).toBe(true);
  });
});
describe("M7 Kubernetes Manifests Validation", () => {
  const k8sDir = path.join(__dirname, "../k8s");

  test("Kubernetes deployment manifest present and valid", () => {
    const deploymentFile = path.join(k8sDir, "deployment.yaml");
    expect(fs.existsSync(deploymentFile)).toBe(true);

    const content = fs.readFileSync(deploymentFile, "utf8");
    expect(content).toMatch(/kind:\s*Deployment/i);
    expect(content).toMatch(/spec:/i);
    expect(content).toMatch(/replicas:/i);
  });

  test("Kubernetes service manifest present and valid", () => {
    const serviceFile = path.join(k8sDir, "service.yaml");
    expect(fs.existsSync(serviceFile)).toBe(true);

    const content = fs.readFileSync(serviceFile, "utf8");
    expect(content).toMatch(/kind:\s*Service/i);
    expect(content).toMatch(/ports:/i);
    expect(content).toMatch(/targetPort:\s*80/i);
  });
});