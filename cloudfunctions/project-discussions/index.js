const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "list";

  try {
    if (action === "list") {
      const data = await repository.listProjectDiscussions(event.projectId);
      return success(data, "Project discussions fetched successfully");
    }

    if (action === "create") {
      const created = await repository.createProjectDiscussion(event);
      return success(created, "Project discussion created successfully");
    }

    return failure("Unsupported project discussions action", { action });
  } catch (error) {
    return failure("Project discussions function crashed", error.message);
  }
};
