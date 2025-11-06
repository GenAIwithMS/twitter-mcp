# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2025-11-06

### Added
- Image posting support via `post_tweet_with_image` tool
- Support for JPG, PNG, GIF, and WEBP image formats
- Media upload functionality using Twitter API v1.1
- Automatic MIME type detection for images
- Comprehensive documentation and setup guides

### Changed
- Package published as `@muhammadsiddiq/twitter-mcp` on npm
- Updated repository URLs to genaiwithms
- Enhanced error handling for file operations
- Improved README with professional documentation

### Technical Details
- Added `uploadMedia()` method in TwitterClient
- Added `postTweetWithImage()` method in TwitterClient
- Added `getMimeType()` helper function
- Extended type definitions for image posting
- Updated MCP tool registration

## [0.2.0] - Previous

### Features
- Post text tweets
- Search tweets
- Reply to tweets
- Rate limiting protection
- OAuth 1.0a authentication

---

For more information, see the [README](README.md).
