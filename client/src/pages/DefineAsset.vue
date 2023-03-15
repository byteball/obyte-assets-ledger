<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-form @submit.prevent.stop='submitForm' >
        <div class="q-pa-md row items-start q-gutter-md">
          <q-card
            class="my-card text-white"
            style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
          >
            <q-card-section>
              <div class="text-h6">Obyte Asset Properties</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-list dense>
                <q-item>Unlimited capitalisation</q-item>
                <q-item>Not private</q-item>
                <q-item>Transferable</q-item>
                <q-item>Auto destroy</q-item>
                <q-item>No fixed denominations</q-item>
                <q-item>Issued by definer only</q-item>
                <q-item>Not cosigned by definer</q-item>
                <q-item>Not spender attested</q-item>
              </q-list>
            </q-card-section>
          </q-card>
        </div>

        <q-card-actions align="left">
          <q-btn color="amber" dense label="Define Asset" class='q-mb-sm' @click.stop='defineAsset' />
        </q-card-actions>
      </q-form >

      <q-banner v-if='unit' dense inline-actions class="text-white bg-green-4">
        Asset defined. Asset Unit: {{unit}}
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
  name: 'DefineAssetPage',

  data () {
    return {
      title: 'Define Asset',
      caption: 'Please click on Define Asset button to define a new Obyte Asset. '
        + 'Remember to check that 1st address has funds. '
        + 'If required, use Move Bytes API to consolidate Bytes.',
      unit: null,
    }
  },

  methods: {
    async defineAsset () {
      try {
        this.unit = null
        const response = await api().post('assets/')
        if (response.status === 201) {
          //let message = 'Asset defined. Asset Unit Id: ' + response.data.unit
          //notify.success(message)
          this.unit = response.data.unit
        }
        else {
          notify.processError(response.data.error)
        }
      }
      catch (err) { notify.processError(err) }
    },

    closeOKBanner () {
      this.unit = null
    }
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }
}
</script>
