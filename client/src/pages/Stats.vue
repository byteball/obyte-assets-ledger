<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />
    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <q-card-section>
          <div class='row'>
            <wf-select-asset :required=true label='Obyte Asset Unit' :includeBase=true :data.sync='asset'  />
          </div>
          <br />
          <div class='row' v-if='showTotals' >
            <q-badge class='q-mr-md' outline color="teal"
              :label="(tokensIssued !== null ? tokensIssued : 'N/A') + ' ' + assetType + ' Issued' " />
            <q-badge class='q-mr-md' outline color="red"
              :label="tokensOnFirstAddress + ' ' + assetType + ' on 1st Address' " />
            <q-badge class='q-mr-md' outline color="orange"
              :label="tokensOnChangeAddress + ' ' + assetType + ' on Change Address' " />
          </div>
          <div class='row q-mt-md' v-if='showTotals' >
            <q-badge class='q-mr-md' outline color="primary"
              :label="tokensOnOtherAddresses + ' ' + assetType + ' on Other Addresses' " />
            <q-badge class='q-mr-md' outline color="grey"
              :label="(tokensOnExternalAddreses !== null ? tokensOnExternalAddreses : 'N/A') 
              + ' ' + assetType + ' on External Addresses' " />
          </div>
        </q-card-section>

        <q-card-section style='max-width: 600px' v-if=" showTotals && asset !== 'base' " >
          <q-table
            :data=' tokens_in_other_addresses '
            :columns=' tokens_in_other_addresses_view '
            :rows-per-page-options="[10]"
          >
          </q-table>
        </q-card-section>

      </q-form >
    </div>
  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'StatsPage',

  data () {
    return {
      title: 'Asset Stats',
      caption: 'Please select Obyte Asset to view stats. Tokens on 1st Address are tokens burned.',
      showTotals: false,
      asset: null,
      tokensIssued: null,
      tokensOnChangeAddress: null,
      tokensOnFirstAddress: null,
      tokensOnOtherAddresses: null,
      tokensOnExternalAddreses: null,
      tokens_in_other_addresses_view: [
        { name: 'address', required: true, label: 'Obyte Headless Wallet Address', field: 'address', align: 'left', classes: 'mono' },
        { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
      ],
      tokens_in_other_addresses: [],
      assetType: null
    }
  },

  methods: {
    async tokenTotals () {
      this.showTotals = false
      this.tokensIssued = null
      this.tokensOnChangeAddress = null
      this.tokensOnFirstAddress = null
      this.tokensOnOtherAddresses = null
      this.tokensOnExternalAddreses = null
      try {
        var asset = encodeURIComponent(this.asset)
        const response = await api().get('stats/' + asset)
        console.log('response: ', response)
        if (response.status === 200) {
          this.tokensIssued = response.data.tokensIssued
          this.tokensOnChangeAddress = response.data.tokensOnChangeAddress
          this.tokensOnFirstAddress = response.data.tokensOnFirstAddress
          this.tokensOnOtherAddresses = response.data.tokensOnOtherAddresses
          this.tokens_in_other_addresses = response.data.otherAddresses
          this.tokensOnExternalAddreses = response.data.tokensOnExternalAddreses
          this.showTotals = true
        }
      }
      catch (err) {
        if (!err) err = 'Unexpected error occured.'
        notify.processError(err)
      }
    },
    async moveBytes () {
      try {
        const response = await api().post('transfer/move-bytes/')
        console.log('response: ', response)
        if (response.status === 201) {
          let message = 'Transferred. Unit: ' + response.data.unit
          notify.success(message)
        }
      }
      catch (err) { notify.processError(err) }
    },
  },

  watch: {
    asset: function () {
        if (this.asset === 'base') this.assetType = 'Bytes'
        else this.assetType = 'Tokens'
        this.tokenTotals()
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
<style>
.mono { font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; }
</style>
