import LoginScreen from "@/screens/LoginScreen";
import RegisterScreen from "@/screens/RegisterScreen";
import { createBrowserRouter } from "react-router-dom";

export const AuthRouter = createBrowserRouter([
    {
        path: "/",
        element: <LoginScreen/>
    },
    {
        path: "/register",
        element: <RegisterScreen/>
    }
]);

