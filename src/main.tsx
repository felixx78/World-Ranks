import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "react-loading-skeleton/dist/skeleton.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SkeletonTheme } from "react-loading-skeleton";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import CountryPage from "./page/CountryPage.tsx";
import CountriesPage from "./page/CountriesPage.tsx";
import Layout from "./layout/Layout.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <CountriesPage />,
      },
      {
        path: "country/:name",
        element: <CountryPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SkeletonTheme baseColor="#3c3f44" highlightColor="#6C727F">
        <RouterProvider router={router} />
      </SkeletonTheme>
    </QueryClientProvider>
  </React.StrictMode>,
);
