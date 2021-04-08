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
            <wf-input-text :required=true label='Amount' :maxlength=24 :data.sync='amount' />
          </div>
        </q-card-section>
        <q-card-actions align="left">
          <q-btn color="amber" dense label="Burn" class='q-mb-sm' @click.stop='burn' />
        </q-card-actions>
      </q-form >
    </div>
  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'BurnTokensPage',

  data () {
    return {
      title: 'Burn Tokens',
      caption: 'Please select Obyte Asset & Amount, then click on Burn button to burn tokens from the Headless Wallet Change Address.',
      asset: null,
      amount: null,
    }
  },

  methods: {
    async burn () {
      try {
        const response = await api().post('transfer/burn/', { asset: this.asset, amount: this.amount})
        console.log('response: ', response)
        if (response.status === 201) {
          let message = 'Tokens Burned. Unit: ' + response.data.unit
          notify.success(message)
        }
      }
      catch (err) { notify.processError(err) }
    },
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
