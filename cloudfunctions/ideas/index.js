const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "list";

  try {
    if (action === "list") {
      const data = await repository.listIdeas();
      return success(data, "Ideas fetched successfully");
    }

    if (action === "detail") {
      const idea = await repository.getIdeaById(event.id);
      return idea ? success(idea, "Idea fetched successfully") : failure("Idea not found");
    }

    if (action === "create") {
      const created = await repository.createIdea(event);
      return success(created, "Idea created successfully");
    }

    return failure("Unsupported ideas action", { action });
  } catch (error) {
    return failure("Ideas function crashed", error.message);
  }
};
