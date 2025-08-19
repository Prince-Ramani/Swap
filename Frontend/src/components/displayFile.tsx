import { Download, Folder } from "lucide-react";
import type { projectInterface } from "@/pages/Home";
import { FormateDate } from "@/services/date";
import DeleteFileDialog from "./deleteFileDialog";
const DisplayFile = ({
  file,
  searchVal,
}: {
  file: projectInterface;
  searchVal?: string;
}) => {
  return (
    <>
      <div className="w-full flex flex-col md:flex-row gap-2 md:gap-0 md:items-center  md:justify-between p-3 md:px-5 bg-card rounded-lg">
        <div className="flex gap-2  md:w-2/6 ">
          <div className="text-sm  md:hidden">Filename :</div>
          <div>
            <Folder className="size-5 lg:size-6" />
          </div>
          <div className="text-card-foreground  text-sm  lg:text-base">
            {file.projectName.trim().length > 10
              ? searchVal
                ? file.projectName
                    .trim()
                    .slice(0, 10)
                    .split("")
                    .map((l, i) =>
                      searchVal.includes(l) ? (
                        <mark key={i} className="text-white bg-green-500">
                          {l}
                        </mark>
                      ) : (
                        l
                      ),
                    )
                : file.projectName.trim().slice(0, 10) + ".."
              : file.projectName}
          </div>
        </div>
        <div className="md:w-1/6 text-sm lg:text-base flex gap-2 md:grid md:place-items-center">
          <div className="text-sm  md:hidden">Time :</div>
          {FormateDate(file.createdAt)}
        </div>
        <div className="md:w-1/6 text-sm lg:text-base flex gap-2 md:grid md:place-items-center">
          <div className="text-sm  md:hidden">Size :</div>
          {file.projectSize}
        </div>

        <div className="md:w-1/6 md:grid place-items-end">
          <DeleteFileDialog projectID={file._id} />
        </div>

        <div className="md:w-1/6 md:grid md:place-items-end">
          <button className="bg-blue-400  w-full md:w-fit p-2 flex gap-2 items-center justify-center text-white rounded-lg active:bg-green-300 disabled:bg-gray-500 ">
            <Download className="size-4 lg:size-5" />
            <div className="md:hidden text-sm"> Download</div>
          </button>
        </div>
      </div>
    </>
  );
};

export default DisplayFile;
