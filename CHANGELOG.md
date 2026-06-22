# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

## [0.3.10] - 2026-06-12

### Added
- New `engage_with_tweet` tool for liking, retweeting, or bookmarking tweets.
- New `media_extraction_helper` tool for extracting direct media URLs
  (images, video, animated GIF) from tweets with variant metadata.

## [0.3.9] - 2026-06-16

### Added
- New `draft_quote_tweet` tool for quoting an existing tweet with AI commentary.
- New `publish_smart_thread` tool for auto-splitting long content into
  threaded tweet chains with paragraph and sentence boundary detection.
- New `search_recent_mentions` tool for monitoring mentions of the
  authenticated user or searching recent tweets by keyword.
- New `fetch_thread_history` tool for retrieving full conversation threads
  by tweet ID, including chronological ordering and reply relationships.

## [0.3.8] - 2026-06-12

### Added
- New `get_user_profile_context` tool for fetching comprehensive Twitter/X user profiles
  including bio, public metrics, pinned tweet, and 5 most recent original tweets.
- Updated `twitter-api-v2` dependency from `1.27.0` to `1.29.0`.

### Changed
- Released package version `0.3.8`.

## [0.3.7] - 2026-06-09

### Added
- Centralized stdio launch flow in the installer.
- Expanded installer documentation for interactive setup.

### Changed
- Released package version `0.3.7`.

## [0.3.6] - 2026-06-08

### Added
- Added `--stdio` routing support.
- Added Hermes and Kilo installer presets.
- Added YAML configuration support.
- Added optional search API key configuration flow.

## [0.3.5] - 2026-06-07

### Changed
- Switched installer payload from Smithery distribution to native npm distribution.
- Released package version `0.3.5`.

## [0.3.4] - 2026-06-06

### Added
- Added interactive universal installer for AI client configuration.
- Added Smithery deployment automation and related configurations.
- Added a lightweight `.mcpb` bundle target for Smithery release flow.

### Changed
- Migrated runtime startup to official MCP server architecture.
- Improved README and Smithery metadata documentation.
- Updated bundling to externalize dependencies and optimize artifact size.
- Updated CI workflows for Smithery packaging and publishing.

### Fixed
- Corrected Smithery publish authentication/environment usage.
- Corrected publish entry point and `smithery.yaml` pathing details.
- Corrected workflow packaging format and lockfile handling in CI.

## [0.3.3] - 2026-06-01

### Changed
- Consolidated duplicated MCP configuration blocks in documentation.
- Updated publish workflow triggers and automation flow.
- Released package version `0.3.3`.

### Fixed
- Corrected workflow step syntax in publish automation.

## [0.3.2] - 2026-06-01

### Added
- Added optional Xquik backend support for `search_tweets`.
- Added optional GetXAPI backend support for `search_tweets`.
- Added documentation for Xquik token and key setup.

## [0.3.1] - 2025-12-29

### Added
- Added MCP server project scaffolding and initial release packaging.
- Added Dockerfile, release/publish workflows, and Smithery configuration.
- Added tweet reply functionality.
- Added evals/tests scaffolding and initial documentation pages.

### Changed
- Renamed package and aligned documentation with new repository/package naming.
- Performed broad README structure and setup documentation improvements.

### Fixed
- Reverted an unintended README update before release finalization.

---

For more information, see the [README](README.md).
