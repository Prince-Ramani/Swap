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
  const { data, isLoading } = useQuery<userInterface | ApiError>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/getMe");
      const data: userInterface | ApiError = await res.json();

      if (!!data && "_id" in data) setAuthUser(data);
      return data;
    },
    retry: false,
  });

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
      </Routes>
    </Router>
  );
}

export default App;
