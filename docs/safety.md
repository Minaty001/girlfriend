# Safety & Guardrails — Neural Core AI OS

## Path Denylist
Files that must never be auto-edited by a loop:

```
.env
.env.*
**/secrets/**
**/credentials/**
**/*_key*
**/*_secret*
.terraform/**
k8s/production/**
**/migrations/**
auth/**
payments/**
billing/**
```

## Auto-Merge Policy

| Allowed | Not Allowed |
|---------|-------------|
| Typo in comments/docs | Behavior changes |
| Lint auto-fix in test files | Dependency version bumps |
| Import ordering | Lockfile changes |
| Config in allowlisted `docs/` paths | Any denylist path |

## MCP Connector Scopes

- GitHub: `read` only for L1/L2
- Filesystem: project root only

## Human Gates

- All denylist path changes require human review
- First 7 days of a new loop: report-only (L1)
- Promote to L2 only after manual review of 3 consecutive clean runs

## Pre-Flight Checks

Before any auto-fix:
1. Is target path on denylist? → escalate
2. Is this attempt # > 3? → escalate
3. Has STATE.md changed since last read? → re-read first
