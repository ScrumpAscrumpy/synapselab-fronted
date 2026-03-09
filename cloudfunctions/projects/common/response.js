function success(data, message = "ok") {
  return {
    code: 0,
    message,
    data,
    timestamp: Date.now(),
  };
}

function failure(message = "error", details = null) {
  return {
    code: 1,
    message,
    details,
    timestamp: Date.now(),
  };
}

module.exports = {
  success,
  failure,
};
