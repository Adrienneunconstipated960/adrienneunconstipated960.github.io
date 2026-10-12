# HueMotion | Source security and performance limitations

This is an **evidence-based review of the original public application**, not a live penetration test, independent Casambi account audit or security certificate.

## Security findings from source inspection

**1. No HTTP authorization for scene commands (high priority).** The original `GET /control?key=...` route accepts eight allowlisted keys, but does not authenticate callers, enforce session permissions per request or check the browser's optional Enable Casambi setting. If an account and scene IDs are configured, a directly submitted GET request can invoke a scene.

**2. Browser-only safeguards.** Off holds, state stabilizing and trigger cooldowns run in browser JavaScript. Calling the HTTP endpoint directly bypasses all of them. Enforce critical authorization and rate limits on the trusted server side, not only the UI.

**3. Network exposure and cross-origin access.** `server.listen(PORT)` does not explicitly bind to `127.0.0.1`. The response sets wildcard `Access-Control-Allow-Origin`. A local host URL in console output is not evidence that the port is isolated to loopback. Use explicit loopback binding for a single-computer demo. Do not publish this route on an internet-facing host.

**4. Credential handling.** The code reads Casambi API key, login, password and network IDs from environment variables or a local `.env` file. Do not commit `.env`, disclose secrets in URLs/screenshots or reproduce personal credentials in a portfolio. The original repository now includes a `.gitignore` covering future `.env` files and dependencies, but already tracked vendor dependencies are not automatically untracked.

**5. Dependencies.** The browser imports MediaPipe `@latest` from a CDN and downloads a model from a Google-hosted address. Version or network changes may break deployment or alter classifier behavior. Pin and validate an explicit version and plan for offline failures.

**6. API failure handling.** The server establishes Casambi sessions via network login and a WebSocket bridge. Live endpoint behavior, reconnection, rate limiting and scene ACK semantics were not verified. Its `ok: true` response after `sendCasambiMessage` indicates a message was queued/sent to the socket; that is not proof that physical luminaire output changed.

## Recommended hardening sequence

1. For a local demo, bind the server explicitly to loopback and do not expose it on guest Wi-Fi or a public tunnel.
2. Require server-side authentication/authorization and an explicit enabled-state check before sending scenes.
3. Replace scene-mutating GET with an authorized POST and appropriate request-origin/CSRF controls.
4. Rate-limit by identity, scene and device, and move the Off-hold policy into the trusted server where applicable.
5. Validate and range-check scene IDs and keep an audit log without exposing tokens or passwords.
6. Add explicit session expiration/rotation, safe reconnection, command acknowledgments and shutdown behavior.
7. Version-pin dependencies, isolate installations and test against intentionally invalid/corrupt credentials.
8. Verify Casambi controller/network ownership and luminaire-state changes in a controlled test area.

No actual server/network vulnerability exploitation was undertaken during this review, and no credentials or scene IDs were accessed.

## Recognition / performance verification gaps

- Original video footage and per-gesture annotated confusion matrix.
- False activation rate and missed gesture rate under lighting/background changes.
- Webcam FPS, MediaPipe model version, browser hardware load and measured end-to-end latency.
- Live scene state updates, bridge reconnect behavior, missed or duplicate commands.
- Accessibility/usability testing with different hand positions and dexterity levels.

Source inspections and synthetic policy unit tests cannot establish any of these physical properties.
