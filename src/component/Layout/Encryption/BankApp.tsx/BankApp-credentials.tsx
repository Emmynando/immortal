import { useEffect, useState, useMemo, type ChangeEvent } from "react";
import axios from "axios";
import { BAITEMS } from "../../../../constants/formItems";
import useForm from "../../../../hooks/useForm";
import InputField from "../../../UI/elements/InputFiels";
import { CustomInputFieldType } from "../../../../constants/formItems";
import SubmitButton from "../../../UI/elements/SubmitButton";
import TextAreaFields from "../../../UI/elements/TextInputFields";
import {
  validateEmailField,
  validatePhoneField,
} from "../../../../constants/helpers";

type BankFormKeys = keyof typeof initialFormData;
const initialFormData = {
  bankName: "",
  username: "",
  password: "",
  transferPin: "",
  dateOfOpening: "",
  emailToContact: "",
  numberToContact: "",
  extraNote: "",
};

export default function BankAppCredentials() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{9,12}$/;
  const { formData, handleChange, errors, setErrors } =
    useForm(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<BankFormKeys, boolean>>
  >({});
  const [nigerianBanks, setNigerianBanks] = useState<
    { name: string; code: string }[]
  >([]);
  const [selectedBank, setSelectedBank] = useState("");
  // Fetch banks only once when component mounts
  useEffect(() => {
    const getNigerianBanks = async () => {
      try {
        // setLoading(true);
        // setError(null);
        const response = await axios.get("https://nigerianbanks.xyz/");

        const banks = response.data;
        setNigerianBanks(banks);
      } catch (err) {
        // setError('Failed to fetch banks');
        console.error("Error fetching banks:", err);
      } finally {
        // setLoading(false);
      }
    };

    getNigerianBanks();
  }, []);

  // Memoize the bank options to prevent re-rendering
  const bankOptions = useMemo(() => {
    return nigerianBanks.map((bank) => (
      <option key={bank.code || bank.name} value={bank.name}>
        {bank.name}
      </option>
    ));
  }, [nigerianBanks]);

  const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === "transferPin") {
      handleChange(event);
      if (value.length !== 4) {
        setErrors((prev) => ({
          ...prev,
          transferPin: "Transfer Pin must be 4 digits",
        }));
      } else {
        // Clear error if valid
        setErrors((prev) => ({ ...prev, transferPin: undefined }));
      }
    } else if (name === "dateOfOpening") {
      handleChange(event);
      const today = new Date();
      const selectedDate = new Date(value);

      if (selectedDate <= today) {
        setErrors((prev) => ({
          ...prev,
          dateOfOpening: "Date must be in the future",
        }));
      } else {
        setErrors((prev) => ({ ...prev, dateOfOpening: undefined }));
      }
    } else {
      handleChange(event);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // mark field as touch
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate based on field type
    if (name === "emailToContact") {
      const isValidPhoneNum = validateEmailField(name, value, emailRegex);

      setErrors((prev) => ({
        ...prev,
        [name]: isValidPhoneNum.error ? isValidPhoneNum.message : undefined,
      }));
    } else if (name === "numberToContact") {
      const isValidPhoneNum = validatePhoneField(name, value, phoneRegex);

      setErrors((prev) => ({
        ...prev,
        [name]: isValidPhoneNum.error ? isValidPhoneNum.message : undefined,
      }));
    } else {
      // For other fields, clear any existing errors
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
    // Call the parent change handler
    handleChange(e);
  };

  async function handleEncryptFile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData) {
      console.log("invalid formdata");
      return;
    }

    try {
      setIsLoading(true);
      console.log(formData);
      return;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <main className="w-full">
      <div>
        <h2>Bank app credentials </h2>
        <form
          className="grid md:grid-cols-2 gap-2 space-y-4 w-full"
          onSubmit={handleEncryptFile}
        >
          <div>
            <label
              className={`relative block uppercase tracking-wide text-black text-xs mt-3 font-medium ml-2 mb-1`}
              htmlFor={"bankName"}
            >
              Bank Name
            </label>
            <select
              id="bankName"
              name="bankName"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select a bank</option>
              {bankOptions}
            </select>
          </div>
          {BAITEMS.map((field) => (
            <div key={field.id} className="w-full">
              <label
                className={`relative block uppercase tracking-wide text-black text-xs mt-3 font-medium ml-2 mb-1`}
                htmlFor={field.name}
              >
                {field.formLabel}
              </label>
              {field.custom_type === CustomInputFieldType.SHORT_TEXT ? (
                <InputField
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof initialFormData]}
                  onChange={handleFormChange}
                  ringColorClass="focus:ring-green-900"
                  // icon={field.icon}
                  theme="dark"
                  error={
                    touched[field.name as BankFormKeys]
                      ? errors[field.name as BankFormKeys]
                      : undefined
                  }
                  isValid={!field.name}
                />
              ) : (
                <TextAreaFields
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  // className="w-full h-[4rem]"
                  onChange={handleTextAreaChange}
                  error={
                    touched[field.name as BankFormKeys]
                      ? errors[field.name as BankFormKeys]
                      : undefined
                  }
                  isValid={!field.name}
                  required
                  // ringColorClass="focus:ring-green-900"
                  // icon={field.icon}
                />
              )}
            </div>
          ))}

          <SubmitButton isLoading={isLoading}>
            {isLoading ? "encrypting..." : "Encrypt File"}
          </SubmitButton>
        </form>
      </div>
    </main>
  );
}
