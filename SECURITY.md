# Security Policy

## Reporting a vulnerability

If you discover a security issue in Skin Picker, please report it privately by emailing **valentin3135@gmail.com** instead of opening a public GitHub issue.

Please include:
- A description of the issue and potential impact
- Steps to reproduce
- The affected version (visible in the app's settings or on the GitHub release tag)

I aim to acknowledge valid reports within 72 hours and will coordinate disclosure with you before publishing a fix.

## Scope

**In scope:**

- The Skin Picker desktop application (this repository)
- The [Rooms server](https://github.com/Nano315/skin-picker-rooms-server) companion backend
- LCU credential handling, IPC between Electron main and renderer processes, Socket.IO event payloads, locally persisted state, opt-in telemetry and error-reporting pipelines

**Out of scope:**

- Vulnerabilities in third-party dependencies — please report those directly to the respective upstream projects
- Issues in Riot's LCU API or the League of Legends client itself
- Social-engineering attacks against end users, and issues requiring physical access to the user's machine

## Supported versions

Only the latest stable release receives security updates. Please update to the most recent version before reporting.
