/** Host half of the dsh-cool-ui bundle: serves its original mecha artwork. */

import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'

/** Cordis plugin name. */
export const name = 'dsh-cool-ui'

/** Required Host service. */
export const inject = ['webServer']

const assets = [
  {
    path: '/dsh-cool-ui/assets/mecha-hangar-hero.png',
    file: fileURLToPath(new URL('../assets/mecha-hangar-hero.png', import.meta.url)),
  },
  {
    path: '/dsh-cool-ui/assets/mecha-settings-command-deck.png',
    file: fileURLToPath(new URL('../assets/mecha-settings-command-deck.png', import.meta.url)),
  },
] as const

/**
 * Mount the artwork routes used by the browser plugin.
 * @param ctx - Web Host context with an active HTTP server.
 */
export function apply(ctx: Context): void {
  for (const asset of assets) {
    ctx.webServer.register({
      kind: 'exact',
      path: asset.path,
      handler: async (_request, response) => {
        const info = await stat(asset.file)
        response.writeHead(200, {
          'Content-Type': 'image/png',
          'Content-Length': info.size,
          'Cache-Control': 'public, max-age=3600',
        })
        createReadStream(asset.file).pipe(response)
      },
    })
  }
}
