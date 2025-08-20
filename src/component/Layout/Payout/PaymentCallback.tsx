import { useState, useEffect } from "react";
import axios from "axios";
import { axiosURl } from "../../../constants/baseURl";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GiCancel } from "react-icons/gi";
import { MdVerified, MdPending } from "react-icons/md";

export const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Verifying payment...");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference =
      urlParams.get("reference") || localStorage.getItem("pending_payment_ref");
    // const reference = localStorage.getItem("pending_payment_ref");

    if (!reference) {
      setStatus("error");
      setMessage("No payment reference found");
      return;
    }

    // Verify payment status
    verifyPayment(reference);
  }, [navigate]);

  const verifyPayment = async (reference: string) => {
    try {
      const response = await axios.get(
        `${axiosURl}/budpay_verify/${reference}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success && response.data.status === "pending") {
        // Poll the backend every 3 seconds for a max of 10 times
        let attempts = 0;

        const pollInterval = setInterval(async () => {
          attempts++;
          const pollResult = await axios.get(
            `${axiosURl}/payments/status/${reference}`,
            { withCredentials: true }
          );

          if (pollResult.data.status !== "pending") {
            clearInterval(pollInterval);
            setStatus(pollResult.data.status);
            // Optionally redirect on definitive success
            if (pollResult.data.status === "success") {
              navigate("/");
            }
          }

          if (attempts >= 10) {
            clearInterval(pollInterval);
            setStatus("Payment confirmation delayed. Please check back later.");
          }
        }, 3000);
      } else if (response.data.success && response.data.status === "success") {
        setStatus("success");
        setMessage("Payment successful! Processing your request...");

        // Redirect to dashboard after delay
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      } else {
        setStatus("failed");
        setMessage("Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage("Payment verification error");
    } finally {
      // Clean up localStorage
      //   localStorage.removeItem("pending_payment_ref");
      localStorage.removeItem("form_data");
    }
  };

  return (
    <div className="p-2 flex justify-center items-center h-screen">
      <div className="h-max space-y-2">
        {status === "error" ? (
          <GiCancel className="text-red-900 size-[12rem]" />
        ) : status === "success" ? (
          <MdVerified className="text-green-700 size-[12rem]" />
        ) : (
          <MdPending className="text-blue-600 size-[12rem]" />
        )}
        <p
          className={`text-lg font-semibold ${
            status === "error"
          } ? text-red-900 : ${
            status === "error"
          } ? text-green-400 : text-center`}
        >
          {message}
        </p>
        {status !== "success" && (
          <button
            className={`text-center mx-[30%] w-max border px-1 rounded-[8px] cursor-pointer ${
              status === "error"
            } ? border-red-900 : border-blue-900`}
          >
            <Link to="/" className="!text-black text-base font-bold">
              Go Home
            </Link>
          </button>
        )}

        {status === "processing" && <div>Loading...</div>}
      </div>
    </div>
  );
};
