import "./index.css";

import { useQuery } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthUser } from "./context/use-auth-user";

import type { userInterface } from "./lib/types";
import type { ApiError } from "./lib/types";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import Home from "./pages/Home";
function App() {
  const { setAuthUser } = useAuthUser();
  const { data, isLoading, isError, error } = useQuery<
    userInterface | ApiError
  >({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/getMe");
        if (!res.ok) {
          let errorMessage = "Something went wrong!";
          try {
            const errorData = await res.json();
            if (errorData?.error && typeof errorData.error === "string")
              errorMessage = errorData.error;
          } catch (err) {
            console.error("Failed to parse error response from server", err);
            errorMessage =
              "Failed to process authorization request. Please try again later.";
          }
          throw new Error(errorMessage);
        }
        const data: userInterface | ApiError = await res.json();

        if (!!data && "_id" in data) setAuthUser(data);
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error occured in authorization", err.message);
          throw err;
        } else {
          console.error("Unexpected error occured in authorization", err);
          throw new Error("Unexpected error occured in authorization");
        }
      }
    },
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  if (isError) {
    console.error(
      error.message || "Somethinf went wrong.Plesae try again later",
    );
  }

  const isAuthUser = !!data && "_id" in data;

  if (isLoading) {
    return <div className="flex justify-center items-center"></div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={isAuthUser ? <Navigate to="/home" /> : <Signup />}
        />
        <Route
          path="/signin"
          element={isAuthUser ? <Navigate to="/home" /> : <Signin />}
        />

        <Route path="/home" element={<Home />} />
        <Route
          path="*"
          element={<Navigate to={isAuthUser ? "/home" : "/signup"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
