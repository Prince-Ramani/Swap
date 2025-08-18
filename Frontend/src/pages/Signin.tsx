import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, OctagonAlert, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const Signin = () => {
  const [info, setInfo] = useState({
    username: "",
    password: "",
  });

  const queryclient = useQueryClient();

  const {
    mutate: signIn,
    isPending,
    data,
  } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      const data = await res.json();

      return data;
    },
    onSuccess: (data) => {
      if ("error" in data) {
        toast.error(data.error);
        return;
      }
      toast.success(data.message);
      queryclient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleClick = () => {
    if (
      !info.username ||
      info.username.trim().length <= 3 ||
      info.username.trim().length > 13
    ) {
      toast.error("Username must be between 3 to 12 charcters.");
      return;
    }

    if (!info.password || info.password.trim() === "") {
      toast.error("Password required.");
      return;
    }

    signIn();
  };

  return (
    <div className="min-h-screen min-w-screen    border flex justify-center items-center bg-background ">
      <div className="flex flex-col  p-2 gap-2 lg:gap-7 w-full max-w-xs md:max-w-sm lg:max-w-lg ">
        <div>
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">
            {" "}
            Signin
          </h1>
        </div>
        <div className="flex gap-3 flex-col">
          <label htmlFor="username">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-muted rounded-sm ">
              <User className="text-gray-400/90  size-5  shrink-0 " />
              <input
                className="focus:outline-none w-full   "
                id="username"
                placeholder="Name"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, username: e.target.value }))
                }
              />
            </div>
          </label>
          <label htmlFor="password">
            <div className=" border gap-2 w-full group    p-2 flex items-center bg-muted rounded-sm">
              <Lock className="text-gray-400/90 size-5 shrink-0   " />
              <input
                className="focus:outline-none w-full"
                type="password"
                id="password"
                placeholder="Password"
                onChange={(e) =>
                  setInfo((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>
          </label>
          <div className="flex flex-col h-fit ">
            {data && "error" in data ? (
              <div className="text-red-700 text-sm sm:text-base   cursor-default px-1 flex gap-2 items-center pb-2">
                <OctagonAlert className="size-5" />
                {data.error}
              </div>
            ) : (
              ""
            )}
            <div className="flex flex-col gap-1">
              <Button
                className="w-full"
                disabled={isPending}
                onClick={handleClick}
              >
                Sign in
              </Button>
              <div>
                Don't have an account?{" "}
                <a href="/signup" className="underline" aria-label="signup">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
