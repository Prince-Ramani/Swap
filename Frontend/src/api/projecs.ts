import type {
  deleteProjectRequest,
  deleteProjectResponse,
} from "@/types/project";
import toast from "react-hot-toast";

export const deleteProject = async (
  body: deleteProjectRequest,
): Promise<deleteProjectResponse> => {
  console.log(body);
  const res = await fetch("/api/project/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Request failed";
    try {
      const errorData = await res.json();
      message = errorData?.error ?? message;
    } catch {
      const text = await res.text().catch(() => "");
      if (text) message = text;
    }
    throw new Error(message);
  }

  const data = (await res.json()) as deleteProjectResponse;

  if ("error" in data) {
    toast.error(data.error);
    throw new Error(data.error);
  }

  return data;
};
