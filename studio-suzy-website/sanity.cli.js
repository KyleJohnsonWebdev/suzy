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
    // The hosted Studio's app id, so deploys never prompt for it.
    appId: 'qidkp88fg3s6pvqb9wmb9nw2',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
