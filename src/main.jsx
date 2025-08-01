// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./router/AppRouter";
import GlobalErrorBoundary from "./components/GlobalErrorBoundary";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <AppRoutes />
    </GlobalErrorBoundary>
  </React.StrictMode>
);
