export class AppError extends Error {
  constructor(message, status = 400, details = {}) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

export function wrapTry(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError(err?.message || "Erro inesperado", 500);
    }
  };
}