# Selected Work — Repository Audit

**Audit date:** 2026-11-03  
**Source:** public repository files on `main`, inspected by shallow clone; GitHub API for the public account/repository index.  
**Scope caveat:** shallow snapshots do not establish complete history, deployments, security posture, or production use. Repository README claims are treated as author documentation until corroborated by code or tests. Scoring indicates evidence in the reviewed snapshot, not project quality certification.

## Selected Work shortlist

1. **OpenAgentStudio — Prototype.** The public README describes a local-first workflow studio for composing, inspecting, and orchestrating agent pipelines. Largest verified candidate by source tree inspected (98 source files), but the inspected snapshot has no tracked test tree or CI workflow. It is a good AI-systems direction, not evidence of a reliable or secure agent runtime. Do not claim durable workflows, provider abstraction, MCP, approval boundaries, or observability without code evidence.
2. **MigrationPilot — Prototype.** Static PostgreSQL migration safety analysis, PostgreSQL AST parsing, risk rules/remediations, CLI and SARIF. Repository contains architecture, security, limitations, analyzer-rule, API, CLI, and migration samples; 18 tracked source files, one test path, two CI workflows. Strong database/platform relevance; no live migration execution.
3. **AccessTrail — Prototype.** Access-review and permission-audit product with server-side anti-self-approval, revocation lifecycle, and SHA-256 hash-chained audit events described in source documentation. 55 tracked source files, four test files, one CI workflow, plus architecture/database/deployment/threat-model docs. Meaningful security domain; validate cryptographic chain and authorization boundaries independently before making assurance claims.
4. **DataQuality Forge — Prototype.** Local data profiling, declarative rules, schema governance, and reporting. 37 tracked source files, five test files, one CI workflow, with architecture, validation and security docs. Product scope is credible; no independent production or scale evidence.
5. **ShipGuard — Functional (narrow verified scope).** Local release-readiness analysis CLI/library with modular checks and SARIF output. 37 tracked source files, eight test files, one CI workflow. Actually executed frozen-lockfile install, all 17 tests (8 files) and TypeScript declaration/ESM build successfully on the checked snapshot. These checks do not validate scanner accuracy, security completeness, or use in production.
6. **School CMS — Functional application, internship project.** Existing portfolio sources its Laravel repository and live site. GitHub repository link verified via account. Scope, deployed behavior, and test coverage were not independently examined in this audit; label does not imply production readiness.

## Evidence-based score matrix

Scores use the requested 100-point rubric: complexity /20, architecture /15, implementation /15, security & reliability /15, tests & maintainability /10, extensibility /10, future relevance /10, documentation /5. Scores are conservative desk-audit judgements based on source/docs/test/CI counts and the specific evidence noted above; they are not benchmark results. README-only claims receive limited credit.

| Repository | Comp. | Arch. | Impl. | Sec./rel. | Test/docs | Ext. | Future | Docs | Total | Evidence / maturity |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| OpenAgentStudio | 15 | 10 | 11 | 5 | 3 | 7 | 9 | 4 | **64** | README and 98 tracked source files inspected; no tracked test tree or CI found; Prototype |
| MigrationPilot | 16 | 12 | 13 | 10 | 6 | 8 | 9 | 5 | **79** | AST-based static analyzer, rule docs, limitations, CLI/API, CI and test path; Prototype |
| AccessTrail | 15 | 12 | 12 | 12 | 7 | 8 | 9 | 5 | **80** | Security architecture/threat model, 4 test files, CI; Prototype pending independent control validation |
| DataQuality Forge | 14 | 11 | 12 | 9 | 7 | 8 | 9 | 5 | **75** | Profiling/rules/schema code, 5 test files, CI, architecture/security docs; Prototype |
| ShipGuard | 14 | 11 | 13 | 10 | 9 | 8 | 9 | 5 | **79** | 8 test files/CI; 17 tests and build passed locally; functional scoped tool |
| School CMS | 9 | 8 | 10 | 7 | 5 | 6 | 6 | 3 | **54** | Existing portfolio/repository link and deployed URL; code/build not audited here; Functional application, scope limited |

## Other reviewed candidates and exclusions

| Candidate | Decision | Evidence and reason |
|---|---|---|
| Additional discovered public repositories | Inventory reviewed via GitHub API; source not inspected, so no scores | Includes `ai-privacy-gateway`, `ai-dataset-governance`, `backup-sentinel`, `oss-dependency-intelligence`, `openbizflow`, `openapi-operations-hub`, `traceforge`, `modelbench-local`, `local-knowledge-graph`, `contractflow`, `openprocure`, `privacy-first-analytics`, `testpilot-ai`, and others. Account-level names/descriptions are discovery evidence only, not implementation verification. |
| AI Workforce Platform | Exclude for now | README calls it a professional starter and lists multi-tenant/RAG/queue components; shallow audit found no tracked test tree or CI workflow. Claims of production deployment were README-only, not independently validated. |
| Autonomous Business Builder | Exclude for now | README calls the MVP complete, documents five agents, UI and mock mode; shallow audit found no tracked test tree or CI workflow. Product is AI-oriented but provides weaker reliability evidence than shortlist alternatives. |
| OpenAPI Operations Hub | Watchlist | 2,010 KB repository, documented architecture, tests including `ssrf.test.ts`, CI and deployment files; potentially strong API-platform case. Full source, tests and build not independently reviewed in this audit, so avoid scoring it as selected work yet. |
| School CMS vs. OpenAPI Operations Hub | Retain School CMS as the full-stack anchor for now | Existing internship evidence and site link are already represented in the portfolio; OpenAPI Hub deserves a deeper follow-up audit before substitution. |
| CryptoMerchant | Exclude | Not source-audited; no technical evidence gathered here to justify an advanced-engineering claim. |
| Object Detection Studio | Exclude | Public repository exists, but this audit gathered no source/test/architecture evidence establishing standout complexity. |
| `api-contract-studio` | Exclude pending direct audit | Profile description is promising; repository source was not fetched and inspected in this pass. |
| `backup-sentinel`, `oss-dependency-intelligence`, `openbizflow`, other profile projects | Watchlist | Repository listings/descriptions verified from account API only. No source inspection or score assigned; descriptions are not proof of implemented scope. |

No scores were invented for candidates lacking source inspection. Listing descriptions alone cannot establish implementation, maturity, security, or performance.

## Improvements and 3–5 year opportunity

- **OpenAgentStudio:** add explicit node/edge contracts, validated workflow schemas, deterministic local executor, bounded tool permissions, human approval for side effects, cancellation/timeouts, persistence, structured per-step events, failure fixtures, unit/integration tests and CI. Then consider provider/MCP adapters and replayable evaluations. Do not add distributed execution before local reliability is measured.
- **MigrationPilot:** test SQL dialect and parser fallbacks against Postgres versions; make risk rules explainable and versioned; expand adversarial/negative tests, safe remediation checks and SARIF contract validation; publish the boundary that static analysis is not proof of zero-downtime safety.
- **AccessTrail:** independently test RBAC/tenant isolation, self-approval bypasses, canonical event encoding, concurrent audit appends, chain tampering, revocation retries/idempotency and connector failure. Document key management, retention, transaction boundaries and threat model; avoid calling the chain immutable or the product compliant.
- **DataQuality Forge:** test malformed/large inputs, resource limits, path traversal and format edge cases; add reproducible rule fixtures, schema-version semantics, provenance and bounded profiling; keep data local unless an explicit integration needs external transfer.
- **ShipGuard:** add golden repositories for scanner false-positive/false-negative regression; document analyzer limits and trust boundaries; test secret redaction across output channels, hostile repository filenames, archive/symlink boundaries, SARIF consumers and CI exit codes. No generic score should override critical gates.
- **Portfolio evidence:** replace README claims with reproducible command output, architecture diagrams, selected code references, test results and explicit limitations on each detail page. Link source first; publish demos only when verified.

## Portfolio change status

Repository research and report complete. Updated `index.html` Selected Work with six evidence-based case studies and maturity labels. Current branch: `feature/instrumental-portfolio-redesign`; HEAD `06802f5`; existing uncommitted redesign preserved. This task also adds `portfolio_audit_report.md`. No commit, push, merge, or deployment performed.

## Verification

- Cloned public source snapshots for OpenAgentStudio, AI Workforce Platform, Autonomous Business Builder, DataQuality Forge, AccessTrail, MigrationPilot, ShipGuard, OpenAPI Operations Hub, and School CMS (read-only audit; no changes to those repositories).
- Queried GitHub API for public account repository inventory and candidate metadata.
- ShipGuard only: `pnpm install --frozen-lockfile`, `pnpm test` (8 files, 17 tests passed), and `pnpm build` all passed on inspected snapshot. `npm ci` was attempted first but repository intentionally has a pnpm lockfile only; switched to pnpm.
- Portfolio: `git diff --check` passed; `node --check assets/js/main.js` passed in prior implementation validation.
- Jekyll build unavailable: Ruby and Bundler are not installed. Browser/viewport visual checks and link crawl not completed. Do not infer them passed.
