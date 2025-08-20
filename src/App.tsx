import { Routes, Route } from "react-router";
import MainLayout from "./component/UI/MainLayout";
import Login from "./component/UI/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./component/Layout/Home";
import SignUpPage from "./component/UI/Signup";
import DashboardPage from "./component/Layout/Dashboard";
import BankAppIndex from "./component/Layout/Encryption/BankApp.tsx/BankAppIndex";
import { PaymentCallback } from "./component/Layout/Payout/PaymentCallback";

const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={clientid}>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUpPage />} />
          <Route path="/payment/callback" element={<PaymentCallback />} />
          {/* Routes with Sidebar (using MainLayout) */}
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="bank-app" element={<BankAppIndex />} />
          </Route>
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
