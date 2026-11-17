import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ygagsfm8',
    dataset: 'production'
  },
  // Her hosted Studio: https://suzy-website.sanity.studio (set so `sanity deploy`
  // targets it without asking).
  studioHost: 'suzy-website',
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
