import { Routes, Route } from "react-router";
import Login from "./component/UI/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./component/Layout/Home";
import SignUpPage from "./component/UI/Signup";
import DashboardPage from "./component/Layout/Dashboard";

const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={clientid}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUpPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
