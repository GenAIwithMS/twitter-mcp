export function formatSuccessResponse(message: string, data: any) {
  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          status: 'success',
          message,
          data,
        }),
      },
    ],
  };
}

export function formatErrorResponse(message: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify({
          status: 'error',
          message,
          error: errorMessage,
        }),
      },
    ],
    isError: true,
  };
}
