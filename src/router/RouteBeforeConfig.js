export default [
  { path: '/issue', needLogin: false },
  { path: '/issue/:id', needLogin: false },
  { path: '/books', needLogin: false },
  { path: '/books/:id', needLogin: false },
  { path: '/interviews', needLogin: false },
  { path: '/personal', needLogin: true },
  { path: '/addIssue', needLogin: true },
  { path: '/searchPage', needLogin: false },
  { path: '/', needLogin: false }
]
