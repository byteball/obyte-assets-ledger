import Vue from 'vue'
import Vuex from 'vuex'

// imports

Vue.use(Vuex)

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
    },

    // enable strict mode (adds overhead) - for dev mode only
    strict: process.env.DEV
  })

  return Store
}
