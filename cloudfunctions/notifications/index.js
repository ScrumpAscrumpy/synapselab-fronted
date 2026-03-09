const { success, failure } = require("./common/response");
const repository = require("./common/repository");

exports.main = async (event = {}) => {
  const action = event.action || "list";

  try {
    if (action === "list") {
      const data = await repository.listNotifications();
      return success(data, "Notifications fetched successfully");
    }

    return failure("Unsupported notifications action", { action });
  } catch (error) {
    return failure("Notifications function crashed", error.message);
  }
};
