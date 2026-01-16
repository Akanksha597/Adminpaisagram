import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Sidebar from "./components/sideBar/Sidebar";
import Dashboard from "./pages/Dashboard";






import ForgotPassword from "./auth/ForgotPassword";
import ResetPassword from "./auth/ResetPassword";

import EventList from "../src/components/Event/EventList";
import EditEvent from "../src/components/Event/Updatedevent";
import Event from "../src/components/Event/Event"
import AdminEventUsers from "./components/Event/AdminEventUsers";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Sidebar />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          
       
      
    
          
           
          
            <Route path="/admin/Eventlist" element={<EventList />} />
            <Route path="/admin/events/edit/:id" element={<EditEvent />} />

            <Route path="/admin/create-event" element={<Event />} />
            <Route path="/admin/CampaignUsers/" element={<AdminEventUsers />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Login />} />
        </Routes>

        {/* 🔔 Toastify Global Container */}
        <ToastContainer position="top-right" autoClose={3000} />
      </Router>
    </AuthProvider>
  );
}

export default App;
