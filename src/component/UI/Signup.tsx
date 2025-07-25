import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import InputField from "./elements/InputFiels";
import { SIGNUPITEMS } from "../../constants/formItems";
import SubmitButton from "./elements/SubmitButton";

const baseUrl = "http://localhost:3002";

export default function SignUpPage() {
  const navigate = useNavigate();
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    emergencyContact: "",
    privacyConsent: false,
  });
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handlePasswordSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData) {
      console.log("Invalid form data");
      return;
    }

    if (!formData.privacyConsent) {
      console.log("Terms and Conditions needs to be accepted");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Password do not match");
      return;
    }
    if (formData.phoneNumber === formData.emergencyContact) {
      console.log("Emergency Contact must be different");
      return;
    }

    const unifiedFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
      firstName: formData.firstName.toUpperCase(),
      lastName: formData.lastName.toUpperCase(),
    };
    setIsLoading(true);
    try {
      const data = await axios.post(
        `${baseUrl}/auth/signup`,
        { ...unifiedFormData, gender },
        {
          withCredentials: true,
        }
      );
      if (data.status !== 201) {
        console.log("Error creating user");
        return;
      }
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  const checkValidation = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const isPhoneNumber = /^[0-9]+?$/.test(value);
    if (name === "phoneNumber" || name === "emergencyContact") {
      if (value === "" || (isPhoneNumber && value.trim().length <= 12)) {
        handleChange(event);
      }
    } else {
      handleChange(event);
    }
  };

  return (
    <main className=" p-2">
      <section className="flex items-center justify-center h-[100%] ">
        <div className="w-[90%] h-max ">
          <h2 className="font-bold text-xl md:text-2xl">
            Get Started On Immortal
          </h2>
          <p className="text-sm text-[#7f7f7f] mb-4">Sign up to begin</p>

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
                      onChange={checkValidation}
                      ringColorClass="focus:ring-green-900"
                      theme="dark"
                    />
                  </div>
                );
              })}
              <div>
                <select
                  value={gender}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setGender(e.target.value)
                  }
                >
                  <option value="" disabled>
                    Select Gender
                  </option>

                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

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
                <Link to="/login" className="!underline !text-black">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
