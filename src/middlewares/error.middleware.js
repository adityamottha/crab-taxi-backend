const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("ERROR:-", err);

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export default errorMiddleware;
