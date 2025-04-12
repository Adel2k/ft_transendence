import { router } from './router.js'

window.addEventListener('DOMContentLoaded', () => {
  router()
  window.addEventListener('popstate', router)
})
