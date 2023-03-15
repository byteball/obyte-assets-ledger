<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <q-card-section>
          <div class='row'>
            <wf-select-address label='Obyte Headless Wallet Address' :data.sync='address' />
            <wf-input-text label='Obyte External Address' :doublewidth=true
              :data.sync='addressExternal' />
          </div>
        </q-card-section>

        <q-card-section style='max-width: 800px' v-if='showTotals' >
          <q-table
            :data=' tokens_on_address '
            :columns=' tokens_on_address_view '
            :rows-per-page-options="[10]"
          >
            <q-td slot="body-cell-actions" slot-scope="props" :props="props">
              <q-btn size='xs' round color="primary" icon="drive_file_move"
                @click.stop='consolidate(props.row)'  />
            </q-td>
          </q-table>
        </q-card-section>
      </q-form >

      <q-banner v-if='unitURL' dense inline-actions class="text-white bg-green-4"> 
        Transferred. Unit:&nbsp;
        <a :href="unitURL" style="color: white;" target="explorer">{{unit}}</a>
        <template v-slot:action >
          <q-btn flat icon='cancel' @click.stop='closeOKBanner'/>
        </template>
      </q-banner>
    </div>
  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'TokensOnAddressPage',

  data () {
    return {
      title: 'Balances',
      caption: 'Please select Obyte Address to view Token Balances',
      showTotals: false,
      address: null,
      addressExternal: null,
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      unitURL: null,
      unit: null,
      tokens_on_address_view: [
        { name: 'actions', label: '', align: 'justify', field: 'asset'},
        { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
        { name: 'utxo', label: 'Unspent outputs', field: 'utxo', align: 'right', sortable: true },
        { name: 'asset', required: true, label: 'Asset', field: 'asset', align: 'right', classes: 'mono' },
      ],
      tokens_on_address: []
    }
  },

  methods: {
    async tokenTotals () {
      this.showTotals = false
      try {
        var address = encodeURIComponent(this.address)
        if (this.addressExternal) address = this.addressExternal.trim()
        const response = await api().get('balances/' + address)
        //console.log('response:', response)
        if (response.status === 200) {
          this.tokens_on_address = response.data
          this.showTotals = true
        }
      }
      catch (err) {
        if (!err) err = 'Unexpected error occured.'
        notify.processError(err)
      }
    },

    async consolidate (row) {
      const payload = {
        asset: row.asset,
        address: this.address
      }
      if (this.addressExternal) payload.address = this.addressExternal.trim()
      try {
        this.unit = null 
        this.unitURL = null
        const response = await api().post('transfer/consolidate', payload)
        if (response.status === 201) {
          //let message = 'Transferred. Unit: ' + response.data.unit
          //notify.success(message)
          this.unit = response.data.unit
          this.unitURL = this.hwObyteNet + response.data.unit
          this.tokenTotals()
        }
        else {
          notify.processError(response.data.error)
        }
      }
      catch (err) { notify.processError(err) }
    },
    closeOKBanner () {
      this.unit = null 
      this.unitURL = null
    }
  },

  watch: {
    address: function () {
        if (this.address) {
          this.addressExternal = null
          this.tokenTotals()
        }
    },
    addressExternal: function () {
      if (this.addressExternal) {
        this.address = null
        if (this.addressExternal.trim().length == 32) {
          this.tokenTotals()
        }
      }
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-address': require('components/shared/fields/SelectCustomer.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
<style>
.mono { font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; }
</style>
