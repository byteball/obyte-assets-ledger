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
            <wf-select-address label='Obyte Headless Wallet "from" Address'
              :data.sync='fromAddress'  />
          </div>
          <div class='row'>
            <wf-select-address label='Obyte Headless Wallet "to" Address'
              :data.sync='toAddress'  />
            <wf-input-text label='Obyte External "to" Address' :doublewidth=true
              :data.sync='toAddressExternal' />
          </div>

          <div class='row'>
            <wf-input-text :required=true label='Amount' :maxlength=24 :data.sync='amount' />
          </div>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn color="amber" dense label="Move" class='q-mb-sm' @click.stop='move' />
        </q-card-actions>
      </q-form >
    </div>

  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'TransferOnMovePage',

  data () {
    return {
      title: 'Transfer on Move',
      caption:
        'Please select Obyte Asset, Obyte to & from Addresses, Amount and click on Move button to transfer tokens.',
      asset: null,
      fromAddress: null,
      toAddress: null,
      toAddressExternal: null,
      amount: null,
    }
  },

  methods: {
    async move () {
      const payload = {
        asset: this.asset,
        fromAddress: this.fromAddress,
        toAddress: this.toAddress,
        amount: this.amount
      }
      if (this.toAddressExternal) payload.toAddress = this.toAddressExternal
      try {
        const response = await api().post('transfer/move/', payload)
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
    toAddress: function () {
      if (this.toAddress) this.toAddressExternal = null
    },
    toAddressExternal: function () {
      if (this.toAddressExternal) this.toAddress = null
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-select-address': require('components/shared/fields/SelectCustomer.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
