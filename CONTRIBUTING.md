# Contributing to Twitter MCP Server

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

1. **Clear title** describing the issue
2. **Steps to reproduce** the bug
3. **Expected behavior** vs **actual behavior**
4. **Environment details:**
   - OS and version
   - Node.js version
   - Package version
5. **Error messages** or logs (if applicable)

### Suggesting Features

Feature requests are welcome! Please include:

1. **Use case** - What problem does it solve?
2. **Proposed solution** - How should it work?
3. **Alternatives** - Other approaches you considered
4. **Examples** - Show how it would be used

### Pull Requests

1. **Fork the repository**
      ```bash
      git clone https://github.com/genaiwithms/twitter-mcp.git
      cd twitter-mcp
      ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clear, commented code
   - Follow existing code style
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm install
   npm run build
   # Test locally with Claude
   ```

5. **Commit with clear messages**
   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

   Commit message format:
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for changes to existing features
   - `Docs:` for documentation only
   - `Refactor:` for code refactoring

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub

## Development Setup

### Prerequisites

- Node.js 18+
- npm
- Git
- Twitter Developer Account

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file** (for testing):
   ```env
   API_KEY=your_test_api_key
   API_SECRET_KEY=your_test_api_secret
   ACCESS_TOKEN=your_test_access_token
   ACCESS_TOKEN_SECRET=your_test_access_token_secret
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Test with Claude:**
   Update Claude config to point to your local build

### Code Style

- Use TypeScript
- Use 2 spaces for indentation
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await for asynchronous code

### Project Structure

```
src/
├── index.ts          # Main server entry
├── twitter-api.ts    # Twitter API client
├── types.ts          # Type definitions
├── formatter.ts      # Response formatting
└── evals/           # Testing utilities
```

## Testing

Before submitting a PR:

1. Build succeeds without errors
2. No TypeScript errors
3. Test basic functionality:
   - Post a tweet
   - Post with image
   - Search tweets
4. Check error handling works

## Documentation

- Update README.md for user-facing changes
- Update CHANGELOG.md with your changes
- Add JSDoc comments for new functions
- Update API Reference if adding/changing tools

## Release Process

(For maintainers)

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Commit changes
4. Create git tag
5. Push to GitHub
6. Publish to npm

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub
- Reach out to maintainers

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
