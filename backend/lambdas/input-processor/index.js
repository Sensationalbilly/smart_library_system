exports.handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { content, userId } = body;

  return {
    statusCode: 200,
    body: JSON.stringify({
      normalized: content.trim(),
      message: "input received"
    })
  };
};
