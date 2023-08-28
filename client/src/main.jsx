/**
=========================================================
* Material Tailwind Dashboard React - v2.0.0
=========================================================
* Product Page: https://www.creative-tim.com/product/material-tailwind-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-tailwind-dashboard-react/blob/main/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from 'react-redux';

import store from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthContextProvider, MaterialTailwindControllerProvider } from "@/context";
import "../public/css/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <BrowserRouter>
    <AuthContextProvider>
      <ThemeProvider>
        <MaterialTailwindControllerProvider>
          <Provider store={store}>
            <App />
            <ToastContainer position="top-right" />
          </Provider>
        </MaterialTailwindControllerProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </BrowserRouter>
  // </React.StrictMode>
);
