import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "@/utils/protectedRoute";
import { AuthContext } from "@/context";
import { useContext } from 'react';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import React from "react";

import Home from './pages/chat/Home';
// import Start from './components/chat/Start';


TimeAgo.addDefaultLocale(en);

function App() {
  const authContext = useContext(AuthContext);


  return (

    <Routes>
      <Route path="/auth/*" element={<Auth />} />

      {/* <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </ProtectedRoute> */}
       <Route exact path="/dashboard/chats" element={<Home />} />
      {/*<Route exact path="/start" element={<Start />} /> */}
      <Route
        exact
        path="/dashboard/*"
        element={
          <ProtectedRoute isAuthenticated={authContext.isAuthenticated}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />
    </Routes>

  );
}

export default App;
