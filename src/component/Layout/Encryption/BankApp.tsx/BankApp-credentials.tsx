import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { BAITEMS } from "../../../../constants/formItems";
import useForm from "../../../../hooks/useForm";
import InputField from "../../../UI/elements/InputFiels";
import { CustomInputFieldType } from "../../../../constants/formItems";
import SubmitButton from "../../../UI/elements/SubmitButton";

export default function BankAppCredentials() {
  const { formData, handleChange } = useForm({
    email: "",
    password: "",
  });
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

  async function handleEncryptFile() {}
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
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleChange(e)
                  }
                  ringColorClass="focus:ring-green-900"
                  // icon={field.icon}
                  theme="dark"
                />
              ) : (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name as keyof typeof formData]}
                  className="w-full h-[4rem] border border-[#4f4f52] "
                  // onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  //   handleChange(e)
                  // }
                  // ringColorClass="focus:ring-green-900"
                  // icon={field.icon}
                  // theme="dark"
                />
              )}
            </div>
          ))}

          {/* <SubmitButton isLoading={isLoading}>
                        {isLoading ? "loading..." : "Log in"}
                      </SubmitButton> */}
        </form>
      </div>
    </main>
  );
}
