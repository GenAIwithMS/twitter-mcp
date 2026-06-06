/* eslint-disable @typescript-eslint/no-empty-object-type */

declare module '@modelcontextprotocol/sdk/server/mcp.js' {
  import { z, ZodRawShape } from 'zod';
  import { Server, ServerOptions } from '@modelcontextprotocol/sdk/server/index.js';

  export type CallToolResult = {
    content: Array<{ type: 'text'; text: string } | { type: 'image'; data: string; mimeType: string }>;
    isError?: boolean;
    _meta?: Record<string, unknown>;
  };

  export type ToolCallback<Args extends ZodRawShape | undefined = undefined> =
    Args extends ZodRawShape
      ? (args: z.objectOutputType<Args, z.ZodTypeAny>, extra: unknown) => CallToolResult | Promise<CallToolResult>
      : (extra: unknown) => CallToolResult | Promise<CallToolResult>;

  export class McpServer {
    readonly server: Server;
    constructor(serverInfo: { name: string; version: string }, options?: ServerOptions);
    connect(transport: { start(): Promise<void>; send(message: unknown): Promise<void>; close(): Promise<void> }): Promise<void>;
    registerTool<InputArgs extends ZodRawShape>(
      name: string,
      config: {
        description?: string;
        inputSchema?: InputArgs;
        outputSchema?: ZodRawShape;
        annotations?: Record<string, unknown>;
        _meta?: Record<string, unknown>;
      },
      cb: ToolCallback<InputArgs>,
    ): unknown;
  }
}

declare module '@modelcontextprotocol/sdk/server/stdio.js' {
  import { Readable, Writable } from 'node:stream';

  export class StdioServerTransport {
    constructor(_stdin?: Readable, _stdout?: Writable);
    onclose?: () => void;
    onerror?: (error: Error) => void;
    onmessage?: (message: unknown) => void;
    start(): Promise<void>;
    close(): Promise<void>;
    send(message: unknown): Promise<void>;
  }
}

declare module '@modelcontextprotocol/sdk/server/index.js' {
  export interface ServerOptions {
    capabilities?: {
      tools?: Record<string, unknown>;
      resources?: Record<string, unknown>;
      prompts?: Record<string, unknown>;
    };
  }

  export class Server {}
}
