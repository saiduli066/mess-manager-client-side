import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import Profile from "@/pages/Profile";
import Reports from "@/pages/Reports";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/home",
        element: (
         
            <Home />
         
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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/add-deposit",
        element: <Profile />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
     
     
    ],
  },
  // {
  //   path: "*",
  //   element:<NotFound/>
  // }
]);
