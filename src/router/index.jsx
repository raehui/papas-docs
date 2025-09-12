import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";

import Estimate from '../pages/estimate.jsx';
import Home from "../pages/Home.jsx";
import Result from "../pages/Result.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "estimate", element: <Estimate /> },
      { path: "result", element: <Result/> },
    ],
  },
]);

export default router;