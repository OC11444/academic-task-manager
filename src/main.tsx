import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("Forcing a fresh build for HashRouter!");

createRoot(document.getElementById("root")!).render(<App />);
