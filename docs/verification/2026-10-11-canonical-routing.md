# Canonical routing only

Legacy query routing was removed at the user's request after the Vue Router
migration. Plugin routes must now be inside the hash. Old outer profile/session,
project/view, return_view, archived, job and scheduled_run values are not used to
select plugin scope or screens. Opening an old query link starts at home;
notification navigation messages without a canonical hash are ignored.

The outer profile query remains a Hermes host concern. Its preservation and the
one-time recovery of canonical document-entry hashes are still required because
host profile hydration can otherwise erase the fragment. This is independent
of the removed plugin query-routing translator.

The router URL resolver now validates only the origin, plugin pathname and hash
prefix. Legacy conversion and outer-query cleanup code were deleted. Browser
and service-worker notification producers emit canonical hashes; worker viewer
attestation and notification clicks no longer interpret query-only URLs.
Canonical hash query fields retain profile and session/return context where
needed on non-chat screens. Existing runtime recovery compatibility and queued
notification title validation are separate from routing and remain unchanged.

## Verification

- vp fmt, vp lint, npm run build and git diff --check passed.
- npm test: 445 tests passed across 30 files, including canonical-only URL
  acceptance, rejection of removed routes, notification URL production, and
  session switching in an already-mounted app without a second runtime.
- npm run test:api: 100 tests passed in the disposable Linux container with
  repository-pinned dependencies and pytest importlib mode.
- Default real-provider dashboard suite: 14 desktop/mobile checks passed in
  2.6 minutes, covering streaming, attachments, artifacts, disclosures, routes,
  Back/Forward, refresh, Settings return destinations, host mount cleanup, and
  rejection of old query screen/session links.
- Two additional desktop/mobile checks passed in 7.9 seconds. They created two
  actual gateway sessions, dispatched notification navigation messages to the
  mounted browser app, verified that old query targets leave the second session
  and its draft intact, then confirmed canonical targets attach the first session
  and replace the composer instance. Composer focus and reconnect state were
  checked, and both screenshots were visually inspected.
- Dashboard assets were rebuilt. No commit was created.

Actual OS notification clicks, HTTPS push delivery and installed iOS/Safari were
not exercised; browser message handling, real session attachment, and service
worker recognition/click behavior are covered separately by browser and unit
checks. Test logs and screenshots remain under ignored tmp and tests/visual-output.

The updated disposable test build is left running at port 9121 for ongoing user
testing. The user's existing port-9120 container and its test session were not
restarted or modified. Cleanup of the new build uses npm run live:stop with
CHATHERMES_INSTANCE=router-canonical.
