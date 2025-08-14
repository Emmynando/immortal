import type { ReactNode } from "react";
export interface InputFieldProps {
  id?: string;
  name: string;
  placeholder: string;
  type: string;
  value: string | number | string[];
  //@ts-ignore
  onChange: any;
  icon?: ReactNode;
  theme: string;
  ringColorClass: string;
  disabled?: boolean;
  isValid?: boolean;
  error?: string;
  max?: string;
}
