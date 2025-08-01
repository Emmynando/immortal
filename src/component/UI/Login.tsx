import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import InputField from "./elements/InputFiels";
import SubmitButton from "./elements/SubmitButton";
const LOGINITEMS = [
  {
    id: "l2",
    formLabel: "Email",
    placeholder: "example@example.com",
    type: "email",
    name: "email",
  },
  {
    id: "l1",
    formLabel: "Password",
    placeholder: "Enter password",
    type: "password",
    name: "password",
  },
];

const baseUrl = "http://localhost:3002";
const clientid = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const client_secret = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

export default function Login() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // google login hook
  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Get user info from Google
        // Exchange authorization code for tokens
        const tokenInfoResponse = await axios.post(
          `https://oauth2.googleapis.com/token`,
          new URLSearchParams({
            client_id: clientid,
            client_secret: client_secret,
            code: tokenResponse.code,
            grant_type: "authorization_code",
            redirect_uri: window.location.origin,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        if (!tokenInfoResponse.data.id_token) {
          console.log("Error: No ID token received");
          return;
        }
        if (!tokenInfoResponse.data.id_token) {
          console.log("error fetching token Info");
          return;
        }

        // Send to backend
        const response = await axios.post(
          `${baseUrl}/auth/oauth/login/callback`,
          { idToken: tokenInfoResponse.data.id_token },

          {
            withCredentials: true,
          }
        );

        if (response.status !== 201) {
          console.log("Error login in");
          return;
        }
        //  navigate
        navigate("/dashboard", { replace: true });
      } catch (error) {
        console.error("Google login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  async function handlePasswordLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) {
      console.log("Invalided form data");
      return;
    }
    setIsLoading(true);
    try {
      const data = await axios.post(`${baseUrl}/auth/login`, formData, {
        withCredentials: true,
      });
      console.log(data);
      // store values in local storage
      localStorage.setItem("userFormData", JSON.stringify(formData));
      if (data.status !== 201) {
        console.log("Error Login in");
        return;
      }
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="h-dvh p-2">
      <section className="flex items-center justify-center h-[100%] ">
        <div className="w-[90%] h-max ">
          <h2 className="font-bold text-xl md:text-2xl">
            Welcome back to Immortal
          </h2>
          <p className="text-sm text-[#7f7f7f] mb-4">
            Login to access your Immortal account
          </p>
          <div className="border rounded-md">
            <button
              className="flex items-center justify-center gap-2 w-full px-2 py-1 cursor-pointer"
              onClick={() => googleLogin()}
            >
              <FcGoogle className="size-[2rem]" />
              <p className="font-normal">Continue with Google</p>
            </button>
          </div>
          <div className="flex items-center justify-center mt-2 w-1/2 mx-auto">
            <div className="flex-1 h-[1px] bg-[#bebebe]"></div>
            <span className="px-[10px] mb-1">or</span>
            <div className="flex-1 h-[1px] bg-[#bebebe]"></div>
          </div>
          {/* form */}
          <div>
            <form className="space-y-4" onSubmit={handlePasswordLogin}>
              {LOGINITEMS.map((field) => (
                <div key={field.id} className="w-full">
                  <label
                    className={`relative block uppercase tracking-wide text-black text-xs mt-3 font-medium`}
                    htmlFor={field.name}
                  >
                    {field.formLabel}
                  </label>
                  <InputField
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof typeof formData]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(e)
                    }
                    ringColorClass="focus:ring-green-900"
                    // icon={field.icon}
                    theme="dark"
                  />
                </div>
              ))}
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input type="checkbox" />
                  <p className="text-xs text-[#7f7f7f] ">Remember me</p>
                </div>
                <div>
                  <a href="/" className="!text-[#7f7f7f] hover:text-blue-900">
                    <p className=" text-xs underline decoration-black hover:text-blue-900">
                      Forgot password
                    </p>
                  </a>
                </div>
              </div>
              <SubmitButton isLoading={isLoading}>
                {isLoading ? "loading..." : "Log in"}
              </SubmitButton>
            </form>
            <div className="w-max mx-auto">
              <p className="text-sm mt-2">
                Don't have an account?{" "}
                <Link to="/register" className="!underline !text-black">
                  Create one for Free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* second box */}
      <section className="w-1/2 bg-red-900"></section>
    </main>
  );
}
