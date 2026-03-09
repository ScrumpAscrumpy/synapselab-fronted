const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "list";

  try {
    if (action === "list") {
      const data = await repository.listComments(event.targetType, event.targetId);
      return success(data, "Comments fetched successfully");
    }

    if (action === "create") {
      const created = await repository.createComment(event);
      return success(created, "Comment created successfully");
    }

    return failure("Unsupported comments action", { action });
  } catch (error) {
    return failure("Comments function crashed", error.message);
  }
};
