<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <div class='row'>
        Headless Wallet First Address:&nbsp;<a :href="hwObyteNet + hwFirstAddress" target="_blank">{{hwFirstAddress}}</a>
      </div>
      <div class='row'>
        Headless Wallet Change Address:&nbsp;<a :href="hwObyteNet + hwChangeAddress" target="_blank">{{hwChangeAddress}}</a>
      </div>

      <q-card-section style='max-width: 600px'>
        <q-table
          :data=' state '
          :columns=' state_view '
          :rows-per-page-options="[11]"
        >
        </q-table>
      </q-card-section>

    </div>

  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'AdminPage',

  data () {
    return {
      title: 'Obyte Headless Wallet',
      caption: 'Details about your Obyte headless wallet.  Remember to fund your 1st address.',
      hwFirstAddress: null,
      hwChangeAddress: null,
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      hwURL: null,
      state_view: [
        { name: 'key', required: true, label: 'Key', align: 'left', field: 'key' },
        { name: 'value', required: true, label: 'Value', align: 'right', field: 'value', format: (val, row) => `${val === null ? '(unset)' : val}` },
      ],
      state: []
    }
  },

  methods: {
    async walletInfo () {
      try {
        const response = await api().get('info/')
        //console.log('response:', response)
        if (response.status === 200) {
          this.hwFirstAddress = response.data.firstAddress
          this.hwChangeAddress = response.data.changeAddress
          this.state = response.data.state
        }
      }
      catch (err) { notify.processError(err) }
    }
  },

  async mounted () {
    await this.walletInfo();
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }

}
</script>
