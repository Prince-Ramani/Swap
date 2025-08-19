import { deleteProject } from "@/api/projecs";
import type {
  deleteProjectRequest,
  deleteProjectResponse,
} from "@/types/project";
import { useMutation } from "@tanstack/react-query";

export const useDeleteProject = () => {
  return useMutation<deleteProjectResponse, Error, deleteProjectRequest>({
    mutationFn: deleteProject,
  });
};
