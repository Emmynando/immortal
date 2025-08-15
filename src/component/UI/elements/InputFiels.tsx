import type { InputFieldProps } from "../../../constants";
import { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const InputField = ({
  id,
  name,
  placeholder,
  type,
  value,
  onChange,
  theme,
  ringColorClass,
  disabled,
  isValid,
  error,
  max,
}: InputFieldProps) => {
  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  const theme_scheme = {
    light: `bg-white border ${
      isValid ? "border-medium-green" : "border-2 border-red-600"
    } text-gray-700 placeholder:text-gray-400`,
    dark: "bg-dark-gray border border-[#4f4f52] text-black placeholder:text-[#4a4a4a]",
  };

  const togglePasswordVisibility = () => setPasswordIsVisible((prev) => !prev);

  return (
    <div className="space-y-2">
      <div className="relative w-full">
        <input
          max={max}
          type={
            type === "password"
              ? passwordIsVisible
                ? "text"
                : "password"
              : type
          }
          // id={id}
          name={name}
          onChange={onChange}
          value={value}
          className={` ${
            theme_scheme[theme as keyof typeof theme_scheme]
          } text-sm rounded-lg focus:ring-1 focus:outline-none text-sm
           text-black placeholder:text-[#bebebe] ${ringColorClass} block w-full p-2.5
            placeholder:text-sm `}
          placeholder={placeholder}
          disabled={disabled}
          required
        />
        {type === "password" && (
          <div className="absolute inset-y-0 right-3 w-fit flex items-center pl-3">
            {!passwordIsVisible ? (
              <MdVisibility
                onClick={togglePasswordVisibility}
                className="text-black"
              />
            ) : (
              <MdVisibilityOff
                onClick={togglePasswordVisibility}
                className="text-black"
              />
            )}
          </div>
        )}
      </div>
      {!isValid && <p className={` italic text-red-500 text-xs`}>{error}</p>}
    </div>
  );
};

export default InputField;
