/** Browser half of dsh-cool-ui: a non-interactive visual layer over the Web shell. */

/** Cordis plugin name. */
export const name = 'dsh-cool-ui-client'

interface EffectContext {
  effect(callback: () => (() => void) | void, label?: string): void
}

const STYLE_ID = 'dsh-cool-ui-style'
const LAYER_ID = 'dsh-cool-ui-layer'
const BACKDROP_ID = 'dsh-cool-ui-backdrop'
const SETTINGS_OPEN_CLASS = 'dsh-cool-ui-settings-open'
const SETTINGS_NAV_SELECTOR = '[class*="_panel"][role="dialog"] [class*="_nav"]'

const css = `
:root.dsh-cool-ui {
  --cool-cyan: #53edff;
  --cool-cyan-soft: rgba(83, 237, 255, .22);
  --cool-amber: #ffb657;
  --cool-ink: #04101c;
}
:root.dsh-cool-ui,
:root.dsh-cool-ui body { min-height: 100%; }
:root.dsh-cool-ui body {
  isolation: isolate;
  background: #02070d !important;
}
#${BACKDROP_ID} {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #02070d url('/dsh-cool-ui/assets/mecha-hangar-hero.png') 68% center / cover no-repeat;
  filter: saturate(1.16) contrast(1.06);
}
:root.dsh-cool-ui body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  background:
    linear-gradient(90deg, rgba(2, 8, 15, .97) 0%, rgba(2, 8, 15, .74) 19%, rgba(2, 8, 15, .12) 54%, rgba(2, 8, 15, .24) 100%),
    repeating-linear-gradient(0deg, rgba(83, 237, 255, .035) 0 1px, transparent 1px 5px);
}
:root.dsh-cool-ui #root {
  position: relative;
  z-index: 2;
}
:root.dsh-cool-ui #root [class*="_frame"] {
  background: linear-gradient(90deg, rgba(2, 10, 20, .86), rgba(3, 12, 23, .12) 58%, rgba(1, 9, 18, .24)) !important;
  box-shadow: inset 0 0 0 1px rgba(83, 237, 255, .14);
}
:root.dsh-cool-ui #root [class*="_frame"] > [class*="_centerCol"],
:root.dsh-cool-ui #root [class*="_frame"] > [class*="_detailsCol"],
:root.dsh-cool-ui #root [class*="_frame"] [class*="_root"] {
  background: transparent !important;
}
:root.dsh-cool-ui #root [class*="_sidebarCol"] {
  background: linear-gradient(180deg, rgba(3, 15, 28, .94), rgba(1, 8, 17, .82)) !important;
  border-right: 1px solid rgba(83, 237, 255, .3);
  box-shadow: 16px 0 42px rgba(0, 0, 0, .26), inset -1px 0 rgba(83, 237, 255, .09);
}
:root.dsh-cool-ui #root [class*="_sidebarCol"]::after {
  content: 'COOL-UI // NEURAL COMMAND';
  position: absolute;
  left: 12px;
  bottom: 18px;
  color: rgba(83, 237, 255, .72);
  font: 700 9px/1 ui-monospace, 'Cascadia Code', monospace;
  letter-spacing: .16em;
  pointer-events: none;
}
:root.dsh-cool-ui #root [class*="_card"],
:root.dsh-cool-ui #root [class*="_newSession"],
:root.dsh-cool-ui #root [class*="_sessionRow"] {
  border: 1px solid rgba(83, 237, 255, .16);
  background: linear-gradient(110deg, rgba(8, 26, 43, .76), rgba(7, 17, 30, .44)) !important;
  box-shadow: inset 0 0 18px rgba(83, 237, 255, .035);
}
:root.dsh-cool-ui body[data-ds-dark-theme] #root [class*="_cardId"] {
  color: #ffffff !important;
}
:root.dsh-cool-ui body[data-ds-dark-theme] #root textarea,
:root.dsh-cool-ui body[data-ds-dark-theme] #root input,
:root.dsh-cool-ui body[data-ds-dark-theme] #root [contenteditable="true"] {
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff;
  caret-color: #ffffff;
}
:root.dsh-cool-ui body[data-ds-dark-theme] #root textarea::placeholder,
:root.dsh-cool-ui body[data-ds-dark-theme] #root input::placeholder,
:root.dsh-cool-ui body[data-ds-dark-theme] #root [contenteditable="true"][data-placeholder]:empty::before,
:root.dsh-cool-ui body[data-ds-dark-theme] #root [contenteditable="true"][data-placeholder]:empty::after {
  color: #aeb8c4 !important;
  -webkit-text-fill-color: #aeb8c4;
  opacity: 1;
}
:root.dsh-cool-ui #root [class*="_selected"],
:root.dsh-cool-ui #root button:hover {
  border-color: rgba(83, 237, 255, .62) !important;
  box-shadow: 0 0 18px rgba(83, 237, 255, .14), inset 0 0 16px rgba(83, 237, 255, .08);
}
:root.dsh-cool-ui #root textarea,
:root.dsh-cool-ui #root input {
  background: rgba(3, 17, 31, .74) !important;
  border-color: rgba(83, 237, 255, .28) !important;
  box-shadow: inset 0 0 22px rgba(0, 0, 0, .35);
}
/* Settings own a separate command-deck scene, rather than merely dimming the chat artwork. */
:root.dsh-cool-ui body.${SETTINGS_OPEN_CLASS} #${BACKDROP_ID} {
  background-image: url('/dsh-cool-ui/assets/mecha-settings-command-deck.png');
  background-position: center;
  filter: saturate(1.04) contrast(1.04) brightness(.72);
}
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_panel"] {
  overflow: hidden;
  border: 1px solid rgba(83, 237, 255, .44);
  background: linear-gradient(135deg, rgba(4, 17, 30, .95), rgba(7, 23, 38, .88)) !important;
  box-shadow: 0 0 0 1px rgba(83, 237, 255, .08), 0 24px 70px rgba(0, 0, 0, .48), inset 0 0 46px rgba(83, 237, 255, .05);
}
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_nav"] {
  background: linear-gradient(180deg, rgba(3, 15, 27, .88), rgba(4, 17, 29, .72)) !important;
  border-right: 1px solid rgba(83, 237, 255, .2);
}
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_content"],
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_header"] {
  background: transparent !important;
}
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_navCell"],
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_themeCube"] {
  border-color: rgba(83, 237, 255, .18) !important;
}
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_active"],
:root.dsh-cool-ui #root [class*="_overlay"] [class*="_selected"] {
  background: linear-gradient(90deg, rgba(28, 89, 111, .5), rgba(9, 39, 59, .38)) !important;
  box-shadow: inset 3px 0 var(--cool-cyan), 0 0 20px rgba(83, 237, 255, .1);
}
/* Resolved light theme: an orbital command deck in porcelain, ice-blue, and brushed silver. */
:root.dsh-cool-ui body:not([data-ds-dark-theme]) {
  --cool-cyan: #007f9f;
  --cool-cyan-soft: rgba(0, 127, 159, .16);
  --cool-amber: #9a5700;
  --cool-ink: #0a2740;
  background: #edf6fb !important;
  color: #09253b;
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #${BACKDROP_ID} {
  background-color: #dcecf6;
  background-image: url('/dsh-cool-ui/assets/mecha-settings-command-deck.png');
  background-position: center;
  filter: saturate(.9) contrast(.96) brightness(1.03);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme])::before {
  background:
    linear-gradient(90deg, rgba(241, 249, 253, .95) 0%, rgba(235, 247, 252, .72) 23%, rgba(232, 246, 252, .26) 60%, rgba(227, 241, 248, .48) 100%),
    repeating-linear-gradient(0deg, rgba(0, 104, 137, .055) 0 1px, transparent 1px 5px);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_frame"] {
  background: linear-gradient(90deg, rgba(246, 252, 255, .88), rgba(234, 247, 252, .38) 57%, rgba(224, 241, 248, .45)) !important;
  box-shadow: inset 0 0 0 1px rgba(0, 102, 136, .16);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_sidebarCol"] {
  background: linear-gradient(180deg, rgba(237, 248, 253, .94), rgba(218, 237, 246, .86)) !important;
  border-right-color: rgba(0, 105, 140, .3);
  box-shadow: 14px 0 34px rgba(30, 78, 104, .12), inset -1px 0 rgba(255, 255, 255, .75);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_sidebarCol"]::after {
  color: rgba(0, 91, 121, .75);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_card"],
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_newSession"],
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_sessionRow"] {
  border-color: rgba(0, 108, 142, .2);
  background: linear-gradient(110deg, rgba(251, 254, 255, .86), rgba(222, 242, 250, .62)) !important;
  box-shadow: inset 0 0 18px rgba(0, 111, 151, .04), 0 7px 18px rgba(17, 70, 95, .06);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root textarea,
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root input {
  color: #09253b !important;
  background: rgba(251, 254, 255, .84) !important;
  border-color: rgba(0, 107, 142, .3) !important;
  box-shadow: inset 0 0 18px rgba(0, 115, 155, .05);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_overlay"] [class*="_panel"] {
  border-color: rgba(0, 107, 142, .4);
  background: linear-gradient(135deg, rgba(252, 254, 255, .95), rgba(225, 242, 250, .91)) !important;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .78), 0 24px 72px rgba(23, 73, 99, .22), inset 0 0 44px rgba(0, 132, 169, .055);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_overlay"] [class*="_nav"] {
  background: linear-gradient(180deg, rgba(231, 245, 251, .93), rgba(213, 234, 245, .86)) !important;
  border-right-color: rgba(0, 105, 140, .22);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_overlay"] [class*="_active"],
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_overlay"] [class*="_selected"] {
  color: #06263d !important;
  background: linear-gradient(90deg, rgba(190, 230, 242, .84), rgba(224, 246, 251, .68)) !important;
  box-shadow: inset 3px 0 #0083a6, 0 0 18px rgba(0, 121, 155, .1);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_overlay"] [class*="_themeCube"] {
  background: rgba(255, 255, 255, .48);
  border-color: rgba(0, 105, 140, .22) !important;
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) #root [class*="_cardId"] {
  color: #8ccce3 !important;
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) .dsh-cool-ui-status {
  background: linear-gradient(135deg, rgba(249, 254, 255, .82), rgba(220, 241, 249, .62));
  border-color: rgba(0, 108, 142, .42);
  box-shadow: 0 0 24px rgba(0, 108, 142, .11);
}
:root.dsh-cool-ui body:not([data-ds-dark-theme]) .dsh-cool-ui-status strong { color: #07314a; }
#${LAYER_ID} {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
  color: var(--cool-cyan);
  font-family: ui-monospace, 'Cascadia Code', Consolas, monospace;
}
#${LAYER_ID}::before {
  content: '';
  position: absolute;
  inset: 14px;
  border: 1px solid rgba(83, 237, 255, .34);
  clip-path: polygon(0 24px, 24px 0, calc(100% - 86px) 0, 100% 86px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 86px 100%, 0 calc(100% - 86px));
  box-shadow: inset 0 0 36px rgba(83, 237, 255, .08), 0 0 18px rgba(83, 237, 255, .16);
}
#${LAYER_ID}::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: .28;
  background-image:
    linear-gradient(rgba(83, 237, 255, .1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(83, 237, 255, .1) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(90deg, transparent 0 17%, black 43% 100%);
}
.dsh-cool-ui-status {
  position: absolute;
  top: 34px;
  right: 44px;
  width: min(288px, 30vw);
  padding: 12px 14px;
  border: 1px solid rgba(83, 237, 255, .42);
  background: linear-gradient(135deg, rgba(3, 15, 27, .84), rgba(4, 13, 25, .48));
  box-shadow: 0 0 24px rgba(83, 237, 255, .12);
  letter-spacing: .12em;
  text-transform: uppercase;
}
.dsh-cool-ui-status strong { display: block; font-size: 11px; color: #d9fbff; }
.dsh-cool-ui-status span { display: block; margin-top: 7px; font-size: 9px; color: var(--cool-amber); }
.dsh-cool-ui-reticle {
  position: absolute;
  right: 27%;
  top: 27%;
  width: 128px;
  aspect-ratio: 1;
  border: 1px solid rgba(83, 237, 255, .32);
  border-radius: 50%;
  box-shadow: 0 0 25px rgba(83, 237, 255, .13);
}
.dsh-cool-ui-reticle::after, .dsh-cool-ui-reticle::before {
  content: '';
  position: absolute;
  background: rgba(83, 237, 255, .42);
}
.dsh-cool-ui-reticle::before { inset: 50% -24px auto; height: 1px; }
.dsh-cool-ui-reticle::after { inset: -24px auto -24px 50%; width: 1px; }
@media (max-width: 760px) {
  #${LAYER_ID}::before { inset: 7px; }
  .dsh-cool-ui-status { top: 18px; right: 20px; width: 190px; }
  .dsh-cool-ui-reticle { display: none; }
}
`

/**
 * Add the decorative mecha command layer without taking ownership of any Host interaction.
 * @param ctx - browser Cordis context.
 */
export function apply(ctx: EffectContext): void {
  const style = document.createElement('style')
  style.id = STYLE_ID
  style.textContent = css

  const backdrop = document.createElement('div')
  backdrop.id = BACKDROP_ID
  backdrop.setAttribute('aria-hidden', 'true')

  const layer = document.createElement('div')
  layer.id = LAYER_ID
  layer.setAttribute('aria-hidden', 'true')
  layer.innerHTML = `
    <section class="dsh-cool-ui-status">
      <strong>Mecha Command Interface</strong>
      <span>Neural link / ready · sector 07</span>
    </section>
    <div class="dsh-cool-ui-reticle"></div>
  `

  document.head.append(style)
  document.body.prepend(backdrop)
  document.body.append(layer)
  document.documentElement.classList.add('dsh-cool-ui')

  const syncSettingsScene = (): void => {
    document.body.classList.toggle(SETTINGS_OPEN_CLASS, document.querySelector(SETTINGS_NAV_SELECTOR) !== null)
  }
  const settingsObserver = new MutationObserver(syncSettingsScene)
  settingsObserver.observe(document.body, { childList: true, subtree: true })
  syncSettingsScene()

  ctx.effect(() => () => {
    settingsObserver.disconnect()
    document.body.classList.remove(SETTINGS_OPEN_CLASS)
    document.documentElement.classList.remove('dsh-cool-ui')
    backdrop.remove()
    layer.remove()
    style.remove()
  }, 'dsh-cool-ui: visual layer')
}
