import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import AuthUserContextProvider from "./context/auth-user-provider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthUserContextProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster
          toastOptions={{
            style: {
              background: "#ff6bef",
              color: "#46204f",
            },
          }}
        />
        <App />
      </QueryClientProvider>
    </AuthUserContextProvider>
  </StrictMode>,
);
