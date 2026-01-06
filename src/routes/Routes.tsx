import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "@/pages/Profile";
import { CreateMess } from "@/components/CreateMess";
import { JoinMess } from "@/components/JoinMess";
import MessEntryOptions from "@/components/MessEntryOptions";
import ProtectRoutes from "./ProtectRoutes";
import AddEntry from "@/pages/AddEntry";
import { AddMember } from "@/pages/AddMember";
import Main from "@/components/Main";
import Records from "@/pages/Records";
import AdminPanel from "@/pages/AdminPanel";
import SettingsPage from "@/pages/settingsPage";
import MyMess from "@/pages/MyMess";
import BazarNotes from "@/pages/BazarNotes";
import MealEntry from "@/pages/MealEntry";
import UserMealStatistics from "@/pages/UserMealStatistics";
import Notifications from "@/pages/Notifications";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Bills from "@/pages/Bills";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Main />
      },
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
        path: "/turn-meal-on/off",
        element: <ProtectRoutes>
          <MealEntry />
        </ProtectRoutes>,
      },
      {
        path: "/my-meal-stat",
        element: <ProtectRoutes>
          <UserMealStatistics />
        </ProtectRoutes>,
      },
      // {
      //   path: "/add-meal",
      //   element: <ProtectRoutes>
      //     <AddEntry />
      //   </ProtectRoutes>,
      // },
      {
        path: "/add-member",
        element: <ProtectRoutes>
          <AddMember />
        </ProtectRoutes>,
      },
      {
        path: "/records",
        element: <ProtectRoutes>

          <Records />
        </ProtectRoutes>,
      },
      {
        path: "/notification",
        element: <ProtectRoutes>

          <Notifications />
        </ProtectRoutes>,
      },
      {
        path: "/admin-panel",
        element: <ProtectRoutes>

          <AdminPanel />
        </ProtectRoutes>,
      },
      {
        path: "/settings",
        element: <ProtectRoutes>

          <SettingsPage />
        </ProtectRoutes>,
      },
      {
        path: "/my-mess",
        element: <ProtectRoutes>

          <MyMess />
        </ProtectRoutes>,
      },
      {
        path: "/bazar-notes",
        element: <ProtectRoutes>

          <BazarNotes />
        </ProtectRoutes>,
      },
      {
        path: "/bills",
        element: <ProtectRoutes>

          <Bills />
        </ProtectRoutes>,
      },


    ],
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  // {
  //   path: "*",
  //   element:<NotFound/>
  // }
]);
