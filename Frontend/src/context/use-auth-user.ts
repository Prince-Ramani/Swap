import { useContext } from "react";
import { AuthUserContext } from "./auth-user-context";

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error("useAuthUser must be used within a UserContextProvider");
  }
  return context;
};
