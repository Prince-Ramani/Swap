import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Home = () => {
  type LogoutSuccessResponse = { message: string };
  type LogoutErrorResponse = { error: string };
  type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;

  const queryClient = useQueryClient();
  const { data, isPending } = useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout");
        if (!res.ok) {
          let errorMessage = "Something went wrong.";
          try {
            const errorData = await res.json();
            if (errorData?.error && typeof errorData.error === "string") {
              errorMessage = errorData.error;
            }
          } catch (error) {
            console.error("Error parsing error response from server : ", error);
            errorMessage =
              "Failed to process logout response. Please try again later.";
          }
          throw new Error(errorMessage);
        }
        const data: LogoutResponse = await res.json();
        return data;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error during logout mutation : ", err.message);
          throw err;
        }
        console.error("Unexpected error during logout : ", err);
        throw new Error("An unexpected error occured while logging out.");
      }
    },

    onSuccess: (data) => {
      if ("error" in data) {
        toast.error(data.error);
        console.log("Logout failed", data.error);
      } else {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
      }
    },
    onError: (error) => {
      const errMessage =
        error.message ||
        "Unexpected error occured while logging out. Please try again later.";
      toast.error(errMessage);
      console.log("Logout error : ", errMessage);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });
  return (
    <div>
      <div className="flex justify-end items-center p-5">
        <Button variant={"destructive"}>Logout</Button>
      </div>
    </div>
  );
};

export default Home;
