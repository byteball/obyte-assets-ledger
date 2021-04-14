
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/info', component: () => import('pages/Info.vue') },
      { path: '/defineAsset', component: () => import('pages/DefineAsset.vue') },
      { path: '/assets', component: () => import('pages/Assets.vue') },
      { path: '/issueAddress', component: () => import('pages/IssueAddress.vue') },
      { path: '/addresses', component: () => import('pages/Addresses.vue') },
      { path: '/buy', component: () => import('pages/TransferOnBuy.vue') },
      { path: '/sell', component: () => import('pages/TransferOnSell.vue') },
      { path: '/move', component: () => import('pages/TransferOnMove.vue') },
      { path: '/move-bytes', component: () => import('pages/TransferOnMoveBytes.vue') },
      { path: '/burn', component: () => import('pages/BurnTokens.vue') },
      { path: '/stats', component: () => import('pages/Stats.vue') },
      { path: '/balances', component: () => import('pages/Balances.vue') },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
