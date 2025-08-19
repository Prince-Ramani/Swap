import { v2 as cloudinary } from "cloudinary";
import { unlink } from "fs/promises";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import User from "../models/userModel";
import Projects from "../models/projectModel";
import { fail } from "assert";
import { asyncWrapProviders } from "async_hooks";

export const uploadProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(userID);
    if (!user) {
      res.status(404).json({ error: "No such user found!" });
      return;
    }

    const file = req.file;
    let failedToUpload: boolean = false;
    let uploadedUrl: string = "";
    let uploadedFileSize = "";
    if (!file) {
      res.status(400).json({ error: "Please select an file." });
      return;
    }
    try {
      const rs = await cloudinary.uploader.upload(file.path, {
        resource_type: "raw",
        folder: "Swap/projectszZipped",
      });
      await unlink(file.path);
      uploadedUrl = rs.secure_url;
      const arr = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(rs.bytes) / Math.log(1024));
      const val = rs.bytes / Math.pow(1024, i);
      uploadedFileSize = `${val.toFixed(2)} ${arr[i]}`;
    } catch (err) {
      failedToUpload = true;
      console.error("Error while uploading files : ", err);
    }

    if (failedToUpload) {
      res.status(400).json("Failed to upload files now.Please try again later");
      return;
    }

    const newProject = new Projects({
      projectName: file.filename,
      projectString: uploadedUrl,
      user: user._id,
      projectSize: uploadedFileSize,
    });
    await newProject.save();
    res.status(202).json({ message: "File uploaded successfully." });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "Error occured in uploadProject controller in projectController.ts file : ",
        err.message,
      );
      console.error("Stack trace", err.stack);
    } else {
      console.error(
        "Unknown error occured in uploadProject controller in projectController.ts file : ",
        err,
      );
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const deleteProject = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized" });
      return;
    }
    const { projectID } = req.body;
    if (!projectID || !isValidObjectId(projectID)) {
      res.status(400).json({ error: "Invalid Project ID" });
      return;
    }

    const user = await User.findById(userID);
    if (!user) {
      res.status(404).json({ error: "No such user found!" });
      return;
    }

    const proj = await Projects.findById(projectID);

    if (!proj) {
      res.status(404).json({ error: "No such project found!" });
      return;
    }

    let failedToDelete: boolean = false;
    try {
      const cloudinaryId = proj.projectString
        .split("/")
        .splice(-1)[0]
        .split(".")[0];

      const zipId = `Swap/projectszZipped/${cloudinaryId}`;
      const rs = await cloudinary.uploader.destroy(zipId, {
        resource_type: "raw",
      });

      if (rs.result !== "ok") failedToDelete = true;
    } catch (err) {
      failedToDelete = true;
      console.error("Failes to delete project : ", err);
    }

    if (failedToDelete) {
      res
        .status(400)
        .json({ error: "Failed to delete files now.Please try again later" });
      return;
    }

    await Projects.findOneAndDelete({ _id: proj._id });

    res.status(200).json({ message: "Project deleted successfully." });
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "Error occured in deleteProject controller in projectController.ts file : ",
        err.message,
      );
      console.error("Stack trace", err.stack);
    } else {
      console.error(
        "Unknown error occured in deleteProject controller in projectController.ts file : ",
        err,
      );
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};

export const getProjects = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userID = req.user;
    if (!userID || !isValidObjectId(userID)) {
      res.status(400).json({ error: "Unauthorized" });
      return;
    }

    const user = await User.findById(userID);
    if (!user) {
      res.status(404).json({ error: "No such user found!" });
      return;
    }

    const projects = await Projects.find({ user: user._id })
      .sort({
        createdAt: "desc",
      })
      .lean();

    res.status(202).json(projects);
    return;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(
        "Error occured in getProjects controller in projectController.ts file : ",
        err.message,
      );
      console.error("Stack trace", err.stack);
    } else {
      console.error(
        "Unknown error occured in getProjects controller in projectController.ts file : ",
        err,
      );
    }
    res.status(500).json({ error: "Internal server error" });
    return;
  }
};
