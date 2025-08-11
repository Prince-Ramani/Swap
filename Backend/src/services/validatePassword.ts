import bcrypt from "bcryptjs";

export const validatePasswordStrength = (password: string) => {
  if (password.length < 6) {
    return {
      valid: false,
      message: "Password must be atleast 6 characters long.",
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter.",
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter.",
    };
  }

  if (!/\d/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number.",
    };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one special character.",
    };
  }

  return { valid: true, message: "Password is Strong." };
};

export const hashPassword = async (password: string): Promise<string> => {
  try {
    const hp = await bcrypt.hash(password, 10);
    return hp;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error hashing password:", err);
      throw new Error("Error hashing password: " + err.message);
    } else {
      console.error("Unexpected error:", err);
      throw new Error("An unknown error occurred while hashing password.");
    }
  }
};

export const verfiyPassword = async (
  enteredPassword: string,
  realPassword: string,
): Promise<boolean> => {
  try {
    const matched = await bcrypt.compare(enteredPassword, realPassword);
    return matched;
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error veryfying password:", err);
      throw new Error("Error verifying password: " + err.message);
    } else {
      console.error("Unexpected error:", err);
      throw new Error("An unknown error occurred while verfying password.");
    }
  }
};
