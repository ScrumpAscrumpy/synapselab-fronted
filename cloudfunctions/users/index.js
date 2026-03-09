const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "profile";

  try {
    if (action === "profile") {
      const user = await repository.getCurrentUser();
      return success(user, "Current user fetched successfully");
    }

    return failure("Unsupported users action", { action });
  } catch (error) {
    return failure("Users function crashed", error.message);
  }
};
