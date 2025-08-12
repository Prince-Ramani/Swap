import { createContext } from "react";
import type { userInterface } from "@/lib/types";
interface AuthUserProviderInterface {
  authUser: userInterface | null;
  setAuthUser: React.Dispatch<React.SetStateAction<userInterface | null>>;
}

export const AuthUserContext = createContext<
  AuthUserProviderInterface | undefined
>(undefined);
