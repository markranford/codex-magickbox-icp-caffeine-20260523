# MagickBoxV3 On ICP

This package is a MagickBoxV3 preview shell generated from the isolated Codex ICP prototype for import through the ICP AI builder.

Required behavior:
- Preserve the observable MagickBoxV3 UX shell: landing, chat workspace, gallery, pricing, settings, and admin routes.
- Use Internet Identity compatible auth.
- Keep application state, credits, jobs, audit events, and media manifests on ICP canisters.
- Use a single builder-provided backend canister if only `PUBLIC_CANISTER_ID:backend` is exposed; use the dedicated media canister when one is available.
- Never point to or modify www.magickbox.ai production services.
- Treat this as an isolated preview, not the final privileged funding canister.
