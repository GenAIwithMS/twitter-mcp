declare module '@modelcontextprotocol/sdk' {
  export interface ServerOptions {
    tools: Array<{
      name: string;
      description: string;
      parameters: any;
      handler: (request: any) => Promise<any>;
    }>;
  }

  export function createServer(options: ServerOptions): {
    start: () => void;
  };
}