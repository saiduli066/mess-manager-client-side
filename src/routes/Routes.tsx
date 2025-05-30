import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "@/pages/Profile";
import Reports from "@/pages/Reports";
import { CreateMess } from "@/components/CreateMess";
import { JoinMess } from "@/components/JoinMess";
import MessEntryOptions from "@/components/MessEntryOptions";
import ProtectRoutes from "./ProtectRoutes";
import AddEntryForm from "@/pages/AddEntry";
import AddEntry from "@/pages/AddEntry";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
          <ProtectRoutes>

            <Home />
          </ProtectRoutes>

        ),
      },
      {
        path: "/landing",
        element: (
          <LandingPage />

        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/create-mess",
        element: <ProtectRoutes>
          <CreateMess />
        </ProtectRoutes>,
      },
      {
        path: "/join-mess",
        element: <ProtectRoutes>
          <JoinMess />
        </ProtectRoutes>,
      },
      {
        path: "/entry-options",
        element: <ProtectRoutes>

          <MessEntryOptions />
        </ProtectRoutes>,
      },
      {
        path: "/profile",
        element: <ProtectRoutes>

          <Profile />
        </ProtectRoutes>,
      },
      {
        path: "/add-deposit",
        element: <ProtectRoutes>
          <AddEntry />
        </ProtectRoutes>,
      },
      {
        path: "/add-meal",
        element: <ProtectRoutes>
          <AddEntry />
        </ProtectRoutes>,
      },
      {
        path: "/reports",
        element: <ProtectRoutes>

          <Reports />
        </ProtectRoutes>,
      },


    ],
  },
  // {
  //   path: "*",
  //   element:<NotFound/>
  // }
]);
