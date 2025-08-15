import { motion } from "framer-motion";
interface SubmitButtonProps {
  isDisabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  containerclass?: string;
}
export default function SubmitButton({
  onClick,
  isLoading,
  children,
  containerclass,
}: SubmitButtonProps) {
  return (
    <motion.button
      className={`px-2 rounded-md w-full py-4 font-semibold cursor-pointer ${containerclass} ${
        isLoading
          ? "text-gray-400 bg-[#474752]"
          : "bg-black text-white hover:text-green-200"
      }`}
      disabled={isLoading}
      type="submit"
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
    >
      {children}
    </motion.button>
  );
}
