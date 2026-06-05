declare module '@modelcontextprotocol/sdk' {
  export interface ToolDefinition {
    name: string;
    description: string;
    parameters: any;
    outputSchema?: any;
    handler: (request: any) => Promise<any>;
  }

  export interface ServerOptions {
    tools: Array<ToolDefinition>;
  }

  export function createServer(options: ServerOptions): {
    start: () => void;
  };
}