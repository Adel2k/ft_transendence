import { router } from './router'

window.addEventListener('DOMContentLoaded', () => {
  router()
  window.addEventListener('popstate', router)
})
