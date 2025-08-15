export const generateUniqueReference = (paymentFor: string) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${paymentFor}_${timestamp}_${randomString}`;
};

export const validateEmailField = (
  name: string,
  value: string,
  emailRegex: RegExp
) => {
  if (!value.trim()) {
    // Empty field - let required validation handle this elsewhere
    return {
      name,
      error: false,
      message: "",
    };
  }

  // Check for comma separation validation first
  if (/\s/.test(value) && !value.includes(",")) {
    return {
      name,
      error: true,
      message: "Please separate multiple emails using commas",
    };
  }

  // Split by comma and validate each email
  const emails = value
    .split(",")
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  for (const email of emails) {
    if (!emailRegex.test(email)) {
      return {
        name,
        error: true,
        message: `"${email}" is not a valid email address`,
      };
    }
  }

  // All emails are valid
  return {
    name,
    error: false,
    message: "",
  };
};

// Helper function to validate phone fields
export const validatePhoneField = (
  name: string,
  value: string,
  phoneRegex: RegExp
) => {
  if (!value.trim()) {
    // Empty field - let required validation handle this elsewhere
    return {
      name,
      error: false,
      message: "",
    };
  }

  // Check for comma separation validation first
  if (/\s/.test(value) && !value.includes(",")) {
    return {
      name,
      error: true,
      message: "Please separate multiple phone numbers using commas",
    };
  }

  // Split by comma and validate each phone number
  const phoneNumbers = value
    .split(",")
    .map((phone) => phone.trim())
    .filter((phone) => phone.length > 0);

  for (const phone of phoneNumbers) {
    if (!phoneRegex.test(phone)) {
      return {
        name,
        error: true,
        message: `"${phone}" is not a valid phone number`,
      };
    }
  }

  // All phone numbers are valid
  return {
    name,
    error: false,
    message: "",
  };
};
