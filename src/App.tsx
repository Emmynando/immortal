import { Routes, Route } from "react-router";
import Login from "./component/UI/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import HomePage from "./component/Layout/Home";
import SignUpPage from "./component/UI/Signup";

const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={clientid}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<SignUpPage />} />
        </Routes>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
