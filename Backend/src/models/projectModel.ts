import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  projectName: {
    type: String,
    required: true,
  },
  projectString: {
    type: String,
    required: true,
  },
});

const Projects = mongoose.model("Projects", projectSchema);

export default Projects;
