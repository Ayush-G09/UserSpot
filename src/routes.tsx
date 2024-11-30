import { createBrowserRouter } from "react-router-dom";
import Layout from "./views/Layout";
import UserView from "./views/User";
import List from "./views/List/List";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <List/>,
      },
      {
        path: 'user/:id',
        element: <UserView/>
      }
    ],
  },
]);
