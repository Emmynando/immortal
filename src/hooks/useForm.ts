import { useState } from "react";
import type { ChangeEvent } from "react";

const useForm = <IFormData>(InitialData: IFormData) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof IFormData, string>>
  >({});
  const [formData, setFormData] = useState<IFormData>(InitialData);
  const [mediaPreview, setMediaPreview] = useState("");

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    if (!event?.target) {
      console.error("Event target is undefined:", event);
      return;
    }
    const { name, value, type } = event?.target;
    const files = (event.target as HTMLInputElement).files;

    if (type === "file") {
      if (files) {
        // if (formData[name as keyof typeof formData])
        setFormData((prevState) => {
          return { ...prevState, [name]: files[0] };
        });
        setMediaPreview(window.URL.createObjectURL(files[0]));
      }
    } else {
      setFormData((prevState) => {
        return { ...prevState, [name]: value };
      });
    }
  };
  //@ts-ignore
  const validate = (validationRules?: {
    [key in keyof IFormData]?: (value: any) => string | null;
  }) => {
    if (!validationRules) return true;

    const newErrors: typeof errors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([fieldName, validateFn]) => {
      const field = fieldName as keyof IFormData;
      //@ts-ignore
      const validate = validateFn as (value: any) => string | null;

      const error = validate(formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  return {
    mediaPreview,
    setMediaPreview,
    formData,
    setFormData,
    handleChange,
    errors,
    validate,
    setErrors,
  };
};

export default useForm;
