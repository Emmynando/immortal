import { useEffect, useState, useMemo, type ChangeEvent } from "react";
import axios from "axios";
import { BAITEMS } from "../../../../constants/formItems";
import { AnimatePresence } from "framer-motion";
import useForm from "../../../../hooks/useForm";
import InputField from "../../../UI/elements/InputFiels";
import { CustomInputFieldType } from "../../../../constants/formItems";
import SubmitButton from "../../../UI/elements/SubmitButton";
import TextAreaFields from "../../../UI/elements/TextInputFields";
import {
  validateEmailField,
  validatePhoneField,
} from "../../../../constants/helpers";
import MotionComponent from "../../../UI/framer-motion/MotionComp";
import { generateUniqueReference } from "../../../../constants/helpers";
import { axiosURl } from "../../../../constants/baseURl";

type BankFormKeys = keyof typeof initialFormData;
const initialFormData = {
  // bankName: "",
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
  const phoneRegex = /^\d{9,13}$/;
  const todayDate = new Date();
  const { formData, handleChange, errors, setErrors } =
    useForm(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState<
    Partial<Record<BankFormKeys, boolean>>
  >({});
  const [nigerianBanks, setNigerianBanks] = useState<
    { name: string; code: string }[]
  >([]);
  const [bankName, setBankName] = useState<string>("");
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
      if (value.length !== 4 || isNaN(Number(value))) {
        setErrors((prev) => ({
          ...prev,
          transferPin: "Transfer Pin must be 4 digits or number",
        }));
      } else {
        // Clear error if valid
        setErrors((prev) => ({ ...prev, transferPin: undefined }));
      }
    } else if (name === "dateOfOpening") {
      handleChange(event);
      const selectedDate = new Date(value);

      if (selectedDate <= todayDate) {
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

    const selectedDate = new Date(formData.dateOfOpening);
    const inputedEmail = formData.emailToContact
      .split(",")
      .map((email) => email.trim());
    const inputedPhoneNum = formData.numberToContact
      .split(",")
      .map((phone) => phone.trim());

    // verify email
    for (const email of inputedEmail) {
      if (!emailRegex.test(email)) {
        console.log(`${email} is not a valid email`);
        return;
      }
    }

    // verify phone number
    for (const phoneNum of inputedPhoneNum) {
      const isValidNigerianNumber =
        (phoneNum.startsWith("0") && phoneNum.length === 11) || // 08123456789
        (phoneNum.startsWith("234") && phoneNum.length === 13) || // 2348123456789
        (phoneNum.match(/^[789]\d{9}$/) && phoneNum.length === 10); // 8123456789, 9012345678, 7012345678

      if (!isValidNigerianNumber) {
        console.log(`${phoneNum} is not a valid phone number`);
        return;
      }
    }

    if (
      !bankName ||
      !formData.username ||
      !formData.password ||
      formData.transferPin.length !== 4 ||
      selectedDate <= todayDate
    ) {
      console.log("invalid formdata");
      return;
    }

    try {
      setIsLoading(true);
      // step 1
      // send form to endpoint
      const generatedRef = generateUniqueReference("cbf");

      const formRepsonse = await axios.post(
        // backend endpoint
        `${axiosURl}/files/bank-file`,
        {
          username: formData.username,
          password: formData.password,
          transferPin: formData.transferPin,
          dateOfOpening: formData.dateOfOpening,
          extraNote: formData.extraNote,
          bankName,
          reference: generatedRef,
          emailToContact: inputedEmail,
          numberToContact: inputedPhoneNum,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 30000, // 30 seconds timeout
        }
      );
      console.log(formRepsonse);

      if (!formRepsonse.data.success) {
        throw new Error("Failed to create file");
      }

      // step II
      // initiate of #50,000 to budpay from the backend
      const { fileId, reference: fileReference } = formRepsonse.data;
      console.log(fileId, fileReference, formRepsonse.data);

      const budpayPayload = {
        amount: 50000,
        currency: "NGN",
        reference: fileReference,
        callback: `${window.location.origin}/payment/callback`,
        webhook: `${axiosURl}/payments/webhook-budpay`,
        metadata: {
          // Send form id for processing
          formID: fileId,
        },
      };

      const initiateBudpayPayment = await axios.post(
        // backend endpoint
        `${axiosURl}/payments/initialize-budpay`,
        budpayPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (!initiateBudpayPayment.data.success) {
        throw new Error(
          initiateBudpayPayment.data.message || "Payment initialization failed"
        );
      }

      // Store reference for callback handling
      localStorage.setItem(
        "pending_payment_ref",
        initiateBudpayPayment.data.data.reference
      );

      const { reference, authorization_url } =
        initiateBudpayPayment.data.data.data;
      console.log(
        "Payment initialized successfully:",
        reference,
        authorization_url
      );
      // step III
      // if payment initiation is successful
      // redirect to budpay popup and make card payment using the authorization url
      //  once the backend, confirms the webhook, it will process the rest of action
      window.location.href = authorization_url;

      console.log("Payment processed");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  //     localStorage.setItem("form_data", JSON.stringify(formData));
  return (
    <AnimatePresence>
      <main className="w-full pt-2">
        <div className="">
          <h2 className="small-header my-2">Bank app credentials </h2>
          {/* <MotionComponent as="div"> */}
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
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
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
                    className="!h-[4rem]"
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

            <SubmitButton isLoading={isLoading} containerclass="col-span-2">
              {isLoading ? "encrypting..." : "Encrypt File"}
            </SubmitButton>
          </form>
          {/* </MotionComponent> */}
        </div>
      </main>
    </AnimatePresence>
  );
}
