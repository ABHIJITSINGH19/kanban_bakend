const globalErrorHandler = (err, req, res, next) => {
  if (typeof err === "string") {
    err = new Error(err);
  }
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message || "Internal Server Error",

    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default globalErrorHandler;
