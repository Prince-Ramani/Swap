import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileWarning, Trash, X } from "lucide-react";
import { Button } from "./ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import { useDeleteProject } from "@/hooks/useProject";

const DeleteFileDialog = ({ projectID }: { projectID: string }) => {
  const { mutate, data, error, isPending } = useDeleteProject();

  console.log(error);
  return (
    <Dialog>
      <DialogTrigger className="bg-red-400  w-fit p-2 flex gap-2 items-center justify-center text-white rounded-lg active:bg-green-300 disabled:bg-gray-500 ">
        <Trash className="size-4 lg:size-5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            folder and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <Button
          className="w-full bg-red-400/90 font-semibold"
          disabled={isPending}
          onClick={() => mutate({ projectID: projectID })}
        >
          <FileWarning /> Delete
        </Button>
        <DialogClose
          className="w-full bg-white/90   font-semibold"
          disabled={isPending}
        >
          <X /> Cancle
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteFileDialog;
