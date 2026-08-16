# dsh-cool-ui

An original mecha-command visual layer for a DeepSeek Harness Web profile.

It is a single DSH bundle: the Host half serves the packaged hero artwork, and the browser half adds a non-interactive HUD, background treatment, and responsive framing without changing the Agent, session, or tool behavior.

## Local development

```powershell
cd E:\code\dsh-cool-ui
pnpm install
pnpm build
cd E:\code\deepseek-harness
pnpm dsh plugin --profile web add E:\code\dsh-cool-ui
pnpm dsh web
```

The bundle uses the public package name `@dsh-cool-ui/plugin`. Its `cordis.patch.yml` inserts one row that activates both the Host and browser halves.

## Design source

`assets/mecha-hangar-hero.png` and `assets/mecha-settings-command-deck.png` are original generated artwork for this project. They are not anime screenshots, franchise assets, characters, logos, or promotional posters.

The visual direction uses common current mecha-key-art traits as abstract reference: dark structural hangars, cyan energy conduits, hard-surface mechanical detail, and sparse amber warnings.

## Scope

This starter is a visual layer over the existing DSH Web shell. A full replacement of the sidebar, conversation layout, and routing would be a separate custom Web shell that still consumes the same DSH Host/API runtime.
