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
            <wf-select-customer :required=true label='Obyte Headless Wallet Customer Address'
              :data.sync='customer'  />
          </div>

          <div class='row'>
            <wf-input-text :required=true label='Amount' :maxlength=24 :data.sync='amount' />
          </div>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn color="amber" dense label="Sell" class='q-mb-sm' @click.stop='sell' />
        </q-card-actions>
      </q-form >
    </div>

  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'TransferOnSellPage',

  data () {
    return {
      title: 'Transfer on Sell',
      caption: 'Please select Obyte Asset, Obyte Address, Amount and click on Sell button to send tokens from specified address.',
      asset: null,
      customer: null,
      amount: null,
    }
  },

  methods: {
    async sell () {
      const payload = {
        asset: this.asset,
        address: this.customer,
        amount: this.amount
      }
      try {
        const response = await api().post('transfer/sell/', payload)
        console.log('response: ', response)
        if (response.status === 201) {
          let message = 'Transferred. Unit: ' + response.data.unit
          notify.success(message)
        }
      }
      catch (err) { notify.processError(err) }
    },
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-select-customer': require('components/shared/fields/SelectCustomer.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
