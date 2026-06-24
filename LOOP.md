# Loop Configuration — Neural Core AI OS

## Active Loops

| Pattern | Cadence | Status | State File |
|---------|---------|--------|------------|
| Daily Triage | 1d | L1 report-only | STATE.md |
| PR Babysitter | 10m (work hours) | L2 assisted | pr-babysitter-state.md |

## Limits

- Max fix attempts per PR: 3
- Auto-merge: **disabled**
- Watched: PRs authored by team / label `loop-watch`

## Human Gates

- Security, auth, payments, infrastructure
- PRs with >10 files changed in loop fix
- All denylist paths (see docs/safety.md)

## Worktrees

- Use `isolation: worktree` when spawning implementer sub-agents (L2+)
- One worktree per fix attempt; discard after verifier REJECT

## Connectors (MCP)

- GitHub: read only for L1/L2
- Filesystem: project root only

## Budget

- Max sub-agent spawns per run: 3
- Review STATE.md daily

## Patterns

- [pr-babysitter.md](../../patterns/pr-babysitter.md)
- [daily-triage.md](../../patterns/daily-triage.md)

## Links

- Checklist: [loop-design-checklist](../../docs/loop-design-checklist.md)
- Safety: [docs/safety.md](docs/safety.md)
