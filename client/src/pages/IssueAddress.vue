<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <div class='row'>
          <div style="width: 480px" class='q-mr-sm q-mb-sm q-ml-sm' v-if='customerWalletAddress' >
            <q-input label="Customer Obyte Wallet Address" outlined dense readonly
              v-model='customerWalletAddress'
              :data.sync='customerWalletAddress' />
          </div>

        </div>
        <q-card-actions >
          <q-btn color="amber" dense label="Create Address" class='q-mb-sm'
            @click.stop='issueNextAddress' />
        </q-card-actions>
      </q-form >
    </div>

  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'IssueAddressesPage',

  data () {
    return {
      title: 'Create Next Headless Wallet Address (customer address)',
      caption: 'Please click on Create Address button to issue next Obyte Headless Wallet Address.  The return address can be assigned to a customer.',
      customerWalletAddress: null
    }
  },

  methods: {
    async issueNextAddress () {
      try {
        this.customerWalletAddress = null
        const response = await api().post('addresses/')
        console.log('response: ', response)
        if (response.status === 201) {
          notify.success({ message: 'New Wallet address: ' + response.data.address });
          this.customerWalletAddress = response.data.address
        }
      }
      catch (err) { notify.processError(err) }
    },
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }
}
</script>
