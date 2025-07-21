import { useState, type ChangeEvent, type FormEvent } from "react";
import useForm from "../../hooks/useForm";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { GoogleLogin } from "@react-oauth/google";
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

const baseUrl = "";

export default function Login() {
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleLogin(credentialResponse: any) {
    console.log("Google login response:", credentialResponse);
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseUrl}/auth/google`,
        {
          googleToken: credentialResponse.credential,
        },
        {
          withCredentials: true,
        }
      );

      console.log("Backend response:", response.data);

      if (response.status === 200) {
        // Store user data or tokens as needed
        localStorage.setItem("accessToken", response.data.accessToken);
        // Redirect to dashboard or home page
        // router.push("/dashboard");
      }
    } catch (error) {
      console.error("Google login failed:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) {
      console.log("Invalided form data");
      return;
    }
    console.log(formData);
    // setIsLoading(true);
    // try {
    //   const data = await axios.post(`${baseUrl}/auth`, formData, {
    //     withCredentials: true,
    //   });
    //   console.log(data);
    //   // store values in local storage
    //   localStorage.setItem("userFormData", JSON.stringify(formData));
    //   if (data.status !== 201) {
    //     // if user does not exist
    //     // redirect to registration page
    //     router.push("/register");
    //     return;
    //   }

    // } catch (error) {
    //   console.log(error);
    // } finally {
    //   setIsLoading(false);
    // }
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
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
              useOneTap={false}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
            />
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
                    htmlFor="name"
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
          </div>
        </div>
      </section>

      {/* second box */}
      <section className="w-1/2 bg-red-900"></section>
    </main>
  );
}

//  <button
//               className="flex items-center justify-center gap-2 w-full px-2 py-1 cursor-pointer"
//               onClick={handleGoogleLogin}
//             >
//               <FcGoogle className="size-[2rem]" />
//               <p className="font-normal">Continue with Google</p>
//             </button>
