import Login from "./component/UI/Login";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
        <Login />
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
