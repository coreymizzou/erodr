# Missing Historical Assets

No original visual assets were supplied in the repository at audit time. The following placeholders or code-drawn UI forms must not be mistaken for originals.

| Missing asset | Placeholder / current handling | Impact |
| --- | --- | --- |
| Original Erodr logo and wordmark | Lowercase `erodr` set as live text; visibly labeled `apps/mobile/assets/erodr/missing-original-erodr-logo.svg` placeholder | Splash/login cannot yet be pixel-faithful |
| Original app icon | Visibly labeled `apps/mobile/assets/erodr/missing-original-app-icon.svg` placeholder; not configured as the shipping icon | Expo icon lacks historical fidelity |
| Original bottom navigation icons | Simple line symbols approximating the observed silhouettes | Geometry can be tuned from screenshot, but source artwork is absent |
| Filter/sliders icon | Code-rendered approximation | Header silhouette only |
| Compose/pencil icon | Code-rendered approximation | Bottom bar silhouette only |
| Anonymous avatar/gender artwork | Neutral code-rendered disc and label | Anonymous feed styling uncertain |
| Historical profile photos and post media | Seeded, clearly demo-only remote imagery/colored placeholders | Content density can be tested, but imagery is not historical |
| Splash/loading artwork | Flat green background | Opening treatment uncertain |
| Login/account creation screenshots | Period-compatible inferred layout | High-fidelity validation impossible until references arrive |
| Composer screenshots and selector assets | Inferred flat controls | Identity/range/lifespan arrangement uncertain |
| Response, conversation, profile, notification, and settings screenshots | Shell derived from observed feed visual language | These screens are behaviorally reconstructed, not visually verified |

The historical App Store screenshot in `reference/external/` is evidence, not an app asset. It is not bundled into the application UI.
