# Native image history loading

The native session attach path requests `inline_images: false` from Hermes so
base64 image data is not serialized into the snapshot before transcript paint.
The retry omits the flag only when the runtime explicitly reports that the
optional parameter is unsupported.

The compact projection preserves ChatHermes durable upload annotations and row
IDs. Uploaded image thumbnails remain available through the authenticated,
profile-scoped preview route; model-facing content is unchanged.

Validated in the isolated worktree based on `main`: 108 API tests, 492 frontend
tests, build, lint, formatting, diff checks, plus the disposable fixture image
history and desktop/mobile browser probes. The fixture measurements are not a
reproduction or before/after measurement of a live user's delay.
