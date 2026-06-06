#!/usr/bin/env node

import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import * as toml from 'smol-toml';

const HOME = os.homedir();
const IS_WIN = os.platform() === 'win32';
const APPDATA = process.env.APPDATA || '';

// Known pre-configured default system file paths for popular AI clients
const PRESET_PATHS: Record<string, string> = {
  claude: IS_WIN 
    ? path.join(APPDATA, 'Claude', 'claude_desktop_config.json')
    : path.join(HOME, '.config', 'Claude', 'claude_desktop_config.json'),
    
  cursor: IS_WIN
    ? path.join(APPDATA, 'Cursor', 'User', 'globalStorage', 'moeriki.mcp-client', 'mcp-servers.json')
    : path.join(HOME, '.config', 'Cursor', 'User', 'globalStorage', 'moeriki.mcp-client', 'mcp-servers.json'),

  opencode: path.join(HOME, '.config', 'opencode', 'opencode.json')
};

async function startInstaller() {
  console.log("\n=========================================");
  console.log("     🤖 X / Twitter MCP Installer       ");
  console.log("=========================================\n");

  // Step 1: Select AI Agent Target Workspace
  const { targetAgent } = await inquirer.prompt([
    {
      type: 'list',
      name: 'targetAgent',
      message: 'Which AI assistant environment do you want to integrate with?',
      choices: [
        { name: 'Claude Desktop App', value: 'claude' },
        { name: 'Cursor IDE', value: 'cursor' },
        { name: 'OpenCode IDE', value: 'opencode' },
        { name: 'Custom Agent (Specify your own config path)', value: 'custom' }
      ]
    }
  ]);

  let targetFilePath = '';
  let selectedSchema = 'mcpServers'; // Default Claude/Cursor schema type

  // Step 2: Path Resolution & Custom Formats Configuration
  if (targetAgent === 'custom') {
    const customInput = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Enter the absolute file path to your custom agent configuration file:',
        validate: (input) => input.trim() ? true : 'Path cannot be empty.'
      },
      {
        type: 'list',
        name: 'schemaType',
        message: 'What configuration structure layout does this custom agent expect?',
        choices: [
          { name: 'Standard Object Key (e.g., "mcpServers": { ... })', value: 'mcpServers' },
          { name: 'OpenCode Property Map (e.g., "mcp": { ... })', value: 'mcp' },
          { name: 'TOML Configuration Table (e.g., [mcp_servers])', value: 'toml' }
        ]
      }
    ]);
    targetFilePath = path.resolve(customInput.filePath.replace(/^~/, HOME));
    selectedSchema = customInput.schemaType;
  } else {
    targetFilePath = PRESET_PATHS[targetAgent];
    if (targetAgent === 'opencode') {
      selectedSchema = 'mcp';
    }
  }

  // Step 3: Sequential Twitter API Credentials Prompts
  console.log("\n--- 🔑 Twitter/X API Credentials Configuration ---");
  const credentials = await inquirer.prompt([
    { type: 'input', name: 'API_KEY', message: 'Enter Twitter Consumer API Key:', validate: (i) => i ? true : 'Required' },
    { type: 'input', name: 'API_SECRET_KEY', message: 'Enter Twitter Consumer API Secret Key:', validate: (i) => i ? true : 'Required' },
    { type: 'input', name: 'ACCESS_TOKEN', message: 'Enter Twitter Access Token:', validate: (i) => i ? true : 'Required' },
    { type: 'input', name: 'ACCESS_TOKEN_SECRET', message: 'Enter Twitter Access Token Secret:', validate: (i) => i ? true : 'Required' }
  ]);

  console.log(`\n⏳ Writing configurations directly to: ${targetFilePath}...`);

  // Step 4: Inject Configuration Block Safely
  try {
    await fs.ensureDir(path.dirname(targetFilePath));

    if (selectedSchema === 'toml') {
      let tomlData: any = {};
      if (await fs.pathExists(targetFilePath)) {
        const fileContent = await fs.readFile(targetFilePath, 'utf-8');
        if (fileContent.trim()) {
          tomlData = toml.parse(fileContent);
        }
      }

      if (!tomlData.mcp_servers) tomlData.mcp_servers = {};
      tomlData.mcp_servers['x-mcp'] = {
        command: "npx",
        args: ["-y", "@muhammadsiddiq/twitter-mcp"],
        env: credentials
      };

      await fs.writeFile(targetFilePath, toml.stringify(tomlData), 'utf-8');

    } else {
      let jsonData: any = {};
      if (await fs.pathExists(targetFilePath)) {
        try {
          jsonData = await fs.readJson(targetFilePath);
        } catch {
          jsonData = {};
        }
      }

      if (selectedSchema === 'mcpServers') {
        if (!jsonData.mcpServers) jsonData.mcpServers = {};
        jsonData.mcpServers['x-mcp'] = {
          command: "npx",
          args: ["-y", "@muhammadsiddiq/twitter-mcp"],
          env: credentials
        };
      } else if (selectedSchema === 'mcp') {
        if (!jsonData.mcp) jsonData.mcp = {};
        jsonData.mcp['x-mcp'] = {
          type: "local",
          command: ["npx", "-y", "@muhammadsiddiq/twitter-mcp"],
          enabled: true,
          environment: credentials
        };
      }

      await fs.writeJson(targetFilePath, jsonData, { spaces: 2 });
    }

    console.log("\n🚀 Success! Your X-MCP server is fully configured. Restart your AI client to start using it.");

  } catch (err: any) {
    console.error(`\n❌ Failed to update configurations: ${err.message}`);
  }
}

startInstaller();
