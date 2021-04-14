<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <q-card-section>
          <div class='row'>
            <wf-select-asset :required=true label='Obyte Asset Unit' :data.sync='asset'  />
          </div>
          <div class='row'>
            <wf-select-customer :required=true label='Obyte Headless Wallet Customer Address' :data.sync='customer'  />
          </div>

          <div class='row'>
            <wf-input-text :required=true label='Amount' :maxlength=24 :data.sync='amount' />
          </div>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn color="amber" dense label="Buy" class='q-mb-sm' @click.stop='buy' />
        </q-card-actions>
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
  name: 'TransferOnBuyPage',

  data () {
    return {
      title: 'Transfer Tokens on Buy',
      caption: 'Please select Obyte Asset, Obyte Address, Amount and click on Buy button to send tokens to specified address.',
      asset: null,
      customer: null,
      amount: null,
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      unitURL: null,
      unit: null,
    }
  },

  methods: {
    async buy () {
      const payload = {
        asset: this.asset,
        address: this.customer,
        amount: this.amount
      }
      try {
        this.unit = null 
        this.unitURL = null
        const response = await api().post('transfer/buy', payload)
        if (response.status === 201) {
          //let message = 'Transferred. Unit: ' + response.data.unit
          //notify.success(message)
          this.unit = response.data.unit
          this.unitURL = this.hwObyteNet + '/' + response.data.unit
        }
      }
      catch (err) {
        notify.processError(err) }
    },
    closeOKBanner () {
      this.unit = null 
      this.unitURL = null
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-select-customer': require('components/shared/fields/SelectCustomer.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
