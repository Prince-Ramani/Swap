import { useState } from "react";
import type { userInterface } from "@/lib/types";
import { AuthUserContext } from "./auth-user-context";

const AuthUserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authUser, setAuthUser] = useState<userInterface | null>(null);

  return (
    <AuthUserContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export default AuthUserContextProvider;
