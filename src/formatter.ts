export function formatSuccessResponse(message: string, data: any) {
  return {
    status: 'success',
    message,
    data,
  };
}

export function formatErrorResponse(message: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  return {
    status: 'error',
    message,
    error: errorMessage,
  };
}