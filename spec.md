# Magick Box On ICP

This package is a Caffeine-shaped preview shell generated from the isolated Codex ICP prototype.

Required behavior:
- Preserve the observable Magick Box UX shell: landing, chat workspace, gallery, pricing, settings, and admin routes.
- Use Internet Identity compatible auth.
- Keep application state, credits, jobs, audit events, and media manifests on ICP canisters.
- Use a single Caffeine backend canister if Caffeine exposes only `PUBLIC_CANISTER_ID:backend`; use the dedicated media canister when one is available.
- Never point to or modify www.magickbox.ai production services.
- Treat this as an isolated preview, not the final privileged funding canister.
