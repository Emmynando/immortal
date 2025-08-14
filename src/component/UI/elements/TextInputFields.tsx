export interface ITextAreaProps {
  name: string;
  id: string;
  value: string | string[];
  onChange: any;
  error?: string;
  isValid: boolean;
  required: boolean;
  disabled?: boolean;
  placeholder: string;
  className?: string;
}

const TextAreaFields = ({
  name,
  id,
  value,
  onChange,
  error,
  // isValid,
  required,
  disabled,
  placeholder,
  className,
}: ITextAreaProps) => {
  const isValid = !error;
  return (
    <div className="space-y-2">
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className={`${
          !isValid
            ? "border border-2 border-red-600"
            : "border border-medium-green focus:border-blue-700"
        }  ${className} block w-full p-2.5 text-sm text-black focus:ring-4 rounded-lg border focus:ring-blue-50`}
        placeholder={placeholder}
        // onFocus={handleFocus}
        autoComplete="off"
        required={required}
        disabled={disabled}
        // onBlur={handleFocus}
        // autoSave="false"
      />

      {!isValid && <p className={`italic text-red-500 text-xs`}>{error}</p>}
    </div>
  );
};

export default TextAreaFields;
