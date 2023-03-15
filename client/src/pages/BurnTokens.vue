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

      <q-banner v-if='unitURL' dense inline-actions class="text-white bg-green-4"> 
        Tokens Burned. Unit:&nbsp;
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
  name: 'BurnTokensPage',

  data () {
    return {
      title: 'Burn Tokens',
      caption: 'Please select Obyte Asset & Amount, then click on Burn button to burn tokens from the Headless Wallet Change Address.',
      asset: null,
      amount: null,
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      unitURL: null,
      unit: null,
    }
  },

  methods: {
    async burn () {
      try {
        this.unit = null 
        this.unitURL = null
        const response = await api().post('transfer/burn/', { asset: this.asset, amount: this.amount})
        if (response.status === 201) {
          //let message = 'Tokens Burned. Unit: ' + response.data.unit
          //notify.success(message)
          this.unit = response.data.unit
          this.unitURL = this.hwObyteNet + response.data.unit
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

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
    'wf-select-asset': require('components/shared/fields/SelectAsset.vue').default,
    'wf-input-text': require('components/shared/fields/InputText.vue').default,
  }
}
</script>
