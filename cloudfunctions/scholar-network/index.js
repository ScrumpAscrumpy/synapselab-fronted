const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "graph";

  try {
    if (action === "graph") {
      const graph = await repository.getScholarNetwork();
      return success(graph, "Scholar network fetched successfully");
    }

    if (action === "join") {
      const graph = await repository.joinScholarNetwork(event);
      return success(graph, "Scholar joined network successfully");
    }

    if (action === "add-paper") {
      const graph = await repository.addScholarPaper(event);
      return success(graph, "Scholar paper added successfully");
    }

    if (action === "delete-paper") {
      const graph = await repository.deleteScholarPaper(event);
      return success(graph, "Scholar paper deleted successfully");
    }

    if (action === "link-project") {
      const graph = await repository.linkScholarProject(event);
      return success(graph, "Scholar project linked successfully");
    }

    return failure("Unsupported scholar-network action", { action });
  } catch (error) {
    return failure(error.message || "Scholar network function crashed", error.stack || error.message);
  }
};
