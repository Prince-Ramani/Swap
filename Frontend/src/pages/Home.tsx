import DisplayFile from "@/components/displayFile";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Folder } from "lucide-react";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type LogoutSuccessResponse = { message: string };
type LogoutErrorResponse = { error: string };
type LogoutResponse = LogoutSuccessResponse | LogoutErrorResponse;
export interface projectInterface {
  projectSize: string;
  projectName: string;
  projectString: string;
  _id: string;
  createdAt: string;
}
const Home = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [allProjects, setAllProjects] = useState<projectInterface[] | []>([]);
  const { isLoading: isLoadingProjects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/project/getProjects");
      if (!res.ok) {
        let errorMessage = "Something went wrong.";
        try {
          const errorData = await res.json();
          if (
            !!errorData &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
            errorMessage = errorData.error;
          }
        } catch (error) {
          console.error("Error parsing error response from server : ", error);
          errorMessage =
            "Failed to process server response. Please try again later.";
        }
        console.error(errorMessage);
        return null;
      }
      const data: projectInterface[] = await res.json();
      setAllProjects(data);
      return null;
    },
  });

  const { mutate: logout, isPending } = useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!res.ok) {
        let errorMessage = "Something went wrong.";
        try {
          const errorData = await res.json();
          if (
            !!errorData &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
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
    },

    onSuccess: async (data) => {
      if ("error" in data) {
        toast.error(data.error);
        console.error("Logout failed", data.error);
      } else {
        toast.success(data.message);
        await queryClient.invalidateQueries({ queryKey: ["authUser"] });
        navigate("/signup");
        window.location.reload();
      }
    },
    onError: async (error) => {
      const errMessage =
        error.message ||
        "Unexpected error occured while logging out. Please try again later.";
      toast.error(errMessage);
      console.error("Logout error : ", errMessage);
      await queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/signup");
      window.location.reload();
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (zipFile: File) => {
      const formData = new FormData();
      formData.append("zipFile", zipFile);
      const res = await fetch("/api/project/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        let errorMessage = "Something went wrong.";
        try {
          const errorData = await res.json();
          if (
            !!errorData &&
            "error" in errorData &&
            typeof errorData.error === "string"
          ) {
            errorMessage = errorData.error;
          }
        } catch (error) {
          console.error("Error parsing error response from server : ", error);
          errorMessage =
            "Failed to process server response. Please try again later.";
        }
        throw new Error(errorMessage);
      }
      const data = await res.json();
      return data;
    },

    onSuccess: async (data) => {
      if (!!data && "error" in data) {
        toast.error(data.error);
        console.error("Failed to upload an folder", data.error);
      } else {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      }
    },
    onError: async (error) => {
      const errMessage =
        error.message ||
        "Unexpected error occured while uploadig file. Please try again later.";
      toast.error(errMessage);
      console.log("Logout error : ", errMessage);
    },
  });

  const handleUploadClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/zip") {
      toast.error("Please upload zip files only");
      return;
    }

    mutate(file);
  };

  return (
    <div className=" flex flex-col  w-full justify-center items-center gap-2 ">
      {/*LOGOUT BUTTON*/}
      <div className="flex justify-end items-center w-full p-3 pb-0 lg:p-5 lg:px-20">
        <Button
          variant={"destructive"}
          className="w-24 lg:text-base lg:p-6"
          onClick={() => logout()}
          disabled={isPending}
        >
          Logout
        </Button>
      </div>

      {/*HEADING*/}
      <p className=" text-3xl  xl:text-4xl flex gap-3 p-4 font-bold">
        <span> WELCOME</span> <span>TO</span>{" "}
        <span className="underline decoration-wavy decoration-green-300 ">
          SWAP
        </span>
      </p>
      {/*Folder SEARCH INPUT*/}
      <div className=" w-[90%] max-w-6xl  sm:p-2  ">
        <label htmlFor="folder">
          <div className="  gap-2 w-full group    p-2 flex items-center bg-muted rounded-sm ">
            <Folder className="text-gray-400/90  size-5  shrink-0 " />
            <input
              className="focus:outline-none w-full   "
              id="folder"
              placeholder="Search Project"
              value={search}
              onChange={(e) => setSearch(e.target.value.trim())}
            />
          </div>
        </label>
      </div>

      {/*MAIN BUTTONS*/}

      <input
        type="file"
        name="fileUpload"
        className="hidden"
        ref={fileInputRef}
        accept=".zip"
        onChange={handleUploadClick}
      />

      <div className=" flex justify-end items-center w-[90%] max-w-6xl p-2">
        <Button size={"lg"} onClick={() => fileInputRef.current?.click()}>
          Upload New
        </Button>
      </div>

      {/*FILE DISPLAYER*/}
      <div className="w-full md:p-2 flex justify-center items-center ">
        <div
          className={` flex flex-col  gap-2  w-full h-full   max-w-6xl  rounded-xl p-1 md:p-2  min-h-72 ${allProjects.length === 0 ? "items-center justify-center" : ""} `}
        >
          {allProjects.length > 0 && !isLoadingProjects ? (
            <div className=" hidden w-full md:flex items-center  justify-between p-3 md:px-5 bg-card rounded-lg text-xs sm:text-xs md:text-base ">
              <div className="w-2/6 grid place-items-start ">File Name</div>
              <div className="w-1/6 grid place-items-center ">Time</div>
              <div className="w-1/6 grid place-items-center ">Size</div>
              <div className="w-1/6 grid place-items-end ">Delete</div>
              <div className="w-1/6 grid place-items-end ">Download</div>
            </div>
          ) : (
            ""
          )}
          {allProjects.length > 0 && !search.trim()
            ? allProjects.map((file) => {
                return <DisplayFile key={file._id} file={file} />;
              })
            : ""}

          {allProjects.length > 0 && search.trim().length > 0
            ? allProjects.map((file) => {
                const includes = file.projectName.includes(search);
                if (includes)
                  return (
                    <DisplayFile
                      key={file._id}
                      file={file}
                      searchVal={search}
                    />
                  );
                else return "";
              })
            : ""}

          {allProjects.length === 0 && !isLoadingProjects ? (
            <div>No Projects found!</div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
