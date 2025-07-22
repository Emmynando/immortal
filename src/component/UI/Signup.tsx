import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import useForm from "../../hooks/useForm";
import InputField from "./elements/InputFiels";
import { SIGNUPITEMS } from "../../constants/formItems";
import SubmitButton from "./elements/SubmitButton";

const baseUrl = "";
export default function SignUpPage() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emergencyContact: "",
    privacyConsent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  // google login hook
  const googleSignup = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);
      setIsLoading(true);
      try {
        // Get user info from Google
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v2/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        console.log(userInfo);

        // Send to your backend
        const response = await axios.post(
          `${baseUrl}/auth/google`,
          {
            loginDeets: userInfo.data,
          },
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          //  navigate
          navigate("/dashboard", { replace: true });
        }
      } catch (error) {
        console.error("Google login failed:", error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => console.log("Login Failed"),
  });

  async function handlePasswordSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) {
      console.log("Invalid form data");
      return;
    }

    console.log(formData);
    setIsLoading(true);
    try {
      const data = await axios.post(`${baseUrl}/auth`, formData, {
        withCredentials: true,
      });
      console.log(data);
      // store values in local storage
      localStorage.setItem("userFormData", JSON.stringify(formData));
      if (data.status !== 201) {
        // if user does not exist
        // redirect to registration page
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className=" p-2">
      <section className="flex items-center justify-center h-[100%] ">
        <div className="w-[90%] h-max ">
          <h2 className="font-bold text-xl md:text-2xl">
            Get Started On Immortal
          </h2>
          <p className="text-sm text-[#7f7f7f] mb-4">Sign up to begin</p>
          <div className="border rounded-md">
            <button
              className="flex items-center justify-center gap-2 w-full px-2 py-1 cursor-pointer"
              onClick={() => googleSignup()}
            >
              <FcGoogle className="size-[2rem]" />
              <p className="font-normal">Signup with Google</p>
            </button>
          </div>
          <div className="flex items-center justify-center mt-2 w-1/2 mx-auto">
            <div className="flex-1 h-[1px] bg-[#bebebe]"></div>
            <span className="px-[10px] mb-1">or</span>
            <div className="flex-1 h-[1px] bg-[#bebebe]"></div>
          </div>
          {/* form */}
          <div>
            <form className="space-y-4" onSubmit={handlePasswordSignUp}>
              {SIGNUPITEMS.map((field) => {
                const val = formData[field.name as keyof typeof formData];
                if (typeof val === "boolean") return null; // skip checkbox for this input

                return (
                  <div key={field.id}>
                    <label
                      className={`relative block uppercase tracking-wide text-black text-xs font-medium`}
                      htmlFor={field.name}
                    >
                      {field.formLabel}
                    </label>
                    <InputField
                      key={field.id}
                      id={field.name}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={val as string | number}
                      onChange={handleChange}
                      ringColorClass="focus:ring-green-900"
                      theme="dark"
                    />
                  </div>
                );
              })}

              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="privacyConsent"
                    checked={formData.privacyConsent}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      handleChange(e);
                    }}
                  />
                  <p className="text-xs text-[#7f7f7f] ">
                    I agree to all Terms and Conditions
                  </p>
                </div>
              </div>

              <SubmitButton isLoading={isLoading}>
                {isLoading ? "loading..." : "Sign up"}
              </SubmitButton>
            </form>
            <div className="w-max mx-auto">
              <p className="text-sm mt-2">
                Already have an account?{" "}
                <Link to="/register" className="!underline !text-black">
                  Login
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
