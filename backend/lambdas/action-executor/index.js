exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({ action: "simulated_action", status: "success" })
  };
};
