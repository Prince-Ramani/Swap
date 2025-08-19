import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectSize: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectString: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Projects = mongoose.model("Projects", projectSchema);

export default Projects;
