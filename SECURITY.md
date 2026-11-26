# Security

## Reporting a vulnerability

Please report it privately through [GitHub's private vulnerability reporting](https://github.com/tiveor/vvg/security/advisories/new), not in a public issue. You'll get an answer within a few days, and a fix and an advisory if the report is confirmed.

## Supported versions

Only the latest release of `@tiveor/vvg` and `@tiveor/vvg-cli` gets security fixes.

## What vvg treats as untrusted

- **Seeds, signatures and titles** are escaped in SVG output.
- **Colors and other paint values from custom palettes and styles** are escaped in SVG attributes, so a palette built from user input can't inject markup.
- **Style and palette names** are looked up as own keys only; names like `__proto__` are refused.
- **Sizes** are limited to 16384 px per side (`MAX_SIDE`), so a size taken from a query string can't exhaust memory.

If you serve SVG made from user input, also send it with `Content-Type: image/svg+xml` and a restrictive `Content-Security-Policy`, as you would for any user-generated SVG.
