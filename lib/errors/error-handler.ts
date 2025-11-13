import { AppError } from "./app-error"

export class ErrorHandler {
  static handle(error: unknown): AppError {
    if (error instanceof AppError) {
      return error
    }

    if (error instanceof Error) {
      return new AppError("INTERNAL_ERROR", error.message, 500, { originalError: error.name })
    }

    return new AppError("UNKNOWN_ERROR", "An unknown error occurred", 500)
  }

  static log(error: AppError): void {
    console.error("[AppError]", {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      timestamp: new Date().toISOString(),
    })
  }

  static async handleAsync<T>(fn: () => Promise<T>): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await fn()
      return { data }
    } catch (error) {
      const appError = this.handle(error)
      this.log(appError)
      return { error: appError }
    }
  }
}
