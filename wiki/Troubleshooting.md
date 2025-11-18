# Troubleshooting

## Claude can't access images
- If using the built-in MCP, ensure Claude Desktop has been granted file access for the folder.
- If using an external filesystem MCP, make sure the MCP is running and `ROOT_DIRS` include the image paths.

## File not found error
- Verify the path is correct and the file is readable by the MCP process.
- Use absolute paths when possible.

## Twitter API errors
- Check that API credentials are correct and not expired.
- Watch for rate limiting; wait and retry or reduce request frequency.

## Push fails when deploying
- Ensure you have push access to the repository and authenticated `git`/`gh` session.
- If remote has new commits, pull/rebase then push.