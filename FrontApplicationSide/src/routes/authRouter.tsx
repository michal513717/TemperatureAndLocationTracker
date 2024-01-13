import LoginScreen from "@/screens/LoginScreen";
import { createBrowserRouter } from "react-router-dom";


export const AuthRouter = createBrowserRouter([
    {
        path: "/",
        element: <LoginScreen/>
    }
]);

