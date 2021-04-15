<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
        <q-card-actions align="left" >
          <q-btn color="amber" dense label="Move Bytes" class='q-mb-sm' @click.stop='moveBytes' />
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
  name: 'TransferOnMoveBytesPage',

  data () {
    return {
      title: 'Transfer Bytes',
      caption:
        'Please click on Move Bytes button to transfer Bytes from the Headless Wallet Change Address.'
        + ' The Bytes will be transfered to the payout address (if defined) or to the 1st Address.',
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      unitURL: null,
      unit: null,
    }
  },

  methods: {
    async moveBytes () {
      try {
        this.unit = null 
        this.unitURL = null
        const response = await api().post('transfer/move-bytes/')
        if (response.status === 201) {
          //let message = 'Transferred. Unit: ' + response.data.unit
          //notify.success(message)
          this.unit = response.data.unit
          this.unitURL = this.hwObyteNet + response.data.unit
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
  }
}
</script>
