// lib/errors.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const handleApiError = (error: unknown) => {
  console.error('API Error:', error)
  if (error instanceof ApiError) {
    return { error: error.message, statusCode: error.statusCode }
  }
  return { error: 'Internal server error', statusCode: 500 }
}
