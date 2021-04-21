<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar class="bg-amber" >
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Obyte Headless Wallet - Tokens
        </q-toolbar-title>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>

        <q-item clickable exact to="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Home page</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-grey-8" > Headless Wallet </q-item-label>

        <q-item clickable exact to="/info">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Headless Wallet Info</q-item-label>
            <q-item-label caption>Obyte Headless Wallet Info</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/issueAddress">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Create Address</q-item-label>
            <q-item-label caption>Issue Obyte Address for customer</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/addresses">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Addresses</q-item-label>
            <q-item-label caption>View Obyte Customer Addresses</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-grey-8" > Assets </q-item-label>

        <q-item clickable exact to="/defineAsset">
          <q-item-section avatar>
            <q-icon name="stars" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Define Asset</q-item-label>
            <q-item-label caption>Define new Obyte Asset</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/assets">
          <q-item-section avatar>
            <q-icon name="stars" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Assets</q-item-label>
            <q-item-label caption>Issued Asset</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-grey-8" > Transfer </q-item-label>

        <q-item clickable exact to="/buy">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Buy Tokens</q-item-label>
            <q-item-label caption>Transfer tokens to a customer</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/sell">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sell Tokens</q-item-label>
            <q-item-label caption>Transfer tokens back to seller</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/move">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Move Tokens</q-item-label>
            <q-item-label caption>Transfer tokens between addresses</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/burn">
          <q-item-section avatar>
            <q-icon name="local_fire_department" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Burn Tokens</q-item-label>
            <q-item-label caption>Burn tokens</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/move-bytes">
          <q-item-section avatar>
            <q-icon name="drive_file_move" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Move Bytes</q-item-label>
            <q-item-label caption>Transfer All Bytes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item-label header class="text-grey-8" > Totals & Balances </q-item-label>

        <q-item clickable exact to="/stats">
          <q-item-section avatar>
            <q-icon name="toll" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Asset Stats</q-item-label>
            <q-item-label caption>View Asset Stats</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable exact to="/balances">
          <q-item-section avatar>
            <q-icon name="toll" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Balances</q-item-label>
            <q-item-label caption>View Wallet Address Balances</q-item-label>
          </q-item-section>
        </q-item>

        <hr/>

        <q-item-label header class="text-grey-8" >
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Asset Ledger API Docs',
    caption: 'Obyte tokens API Docs',
    icon: 'school',
    link: 'https://natalie-seltzer.gitbook.io/obytetokens/'
  },
  {
    title: 'Obyte Token Registry',
    caption: 'tokens.ooo',
    icon: 'app_registration',
    link: `https://${(process.env.DEV ? 'testnet.': '')}tokens.ooo`
  },
  {
    title: 'Obyte on GitHub',
    caption: 'github.com/byteball',
    icon: 'code',
    link: 'https://github.com/byteball'
  },
  {
    title: 'Obyte developer docs',
    caption: 'developer.obyte.org',
    icon: 'book',
    link: 'https://developer.obyte.org/'
  },
  {
    title: 'Obyte Discord community',
    caption: 'obyte.org/discord',
    icon: 'chat',
    link: 'https://obyte.org/discord'
  },
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  }
}
</script>
