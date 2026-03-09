const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "list";

  try {
    if (action === "list") {
      const data = await repository.listProjects();
      return success(data, "Projects fetched successfully");
    }

    if (action === "detail") {
      const project = await repository.getProjectById(event.id);
      return project
        ? success(project, "Project fetched successfully")
        : failure("Project not found");
    }

    return failure("Unsupported projects action", { action });
  } catch (error) {
    return failure("Projects function crashed", error.message);
  }
};
