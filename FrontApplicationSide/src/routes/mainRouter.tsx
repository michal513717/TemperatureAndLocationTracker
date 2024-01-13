import MainScreen from "@/screens/mainScreen";
import { createBrowserRouter } from "react-router-dom";

export const MainRouter = createBrowserRouter([
    {
        path: "/",
        element: <MainScreen/>
    }
]);

