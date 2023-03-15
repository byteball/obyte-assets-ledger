<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <q-card-actions >
          <q-btn color="amber" dense label="Create Address" class='q-mb-sm'
            @click.stop='issueNextAddress' />
        </q-card-actions>
      </q-form >

      <q-banner v-if='address' dense inline-actions class="text-white bg-green-4"> 
        Address Created. New address: {{address}}
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
  name: 'IssueAddressesPage',

  data () {
    return {
      title: 'Create Next Headless Wallet Address (customer address)',
      caption: 'Please click on Create Address button to issue next Obyte Headless Wallet Address.  The return address can be assigned to a customer.',
      address: null,
    }
  },

  methods: {
    async issueNextAddress () {
      try {
        this.customerWalletAddress = null
        this.address = null 
        const response = await api().post('addresses/')
        //console.log('response:', response)
        if (response.status === 201) {
          //notify.success({ message: 'New Wallet address: ' + response.data.address });
          this.address = response.data.address
        }
        else {
          notify.processError(response.data.error)
        }
      }
      catch (err) { notify.processError(err) }
    },

    closeOKBanner () {
      this.address = null 
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }
}
</script>
