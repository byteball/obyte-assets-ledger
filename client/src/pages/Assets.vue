<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <q-card-section style='max-width: 600px'>
      <q-table
        :data=' assets '
        :columns=' assets_view '
        :rows-per-page-options="[10]"
      >
        <q-td slot="body-cell-actions" slot-scope="props" :props="props">
          <q-btn size='xs' round color="primary" icon="visibility"
            @click.stop='viewAsset(props.row)'  />
        </q-td>
      </q-table>
    </q-card-section>
  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'AdminPage',

  data () {
    return {
      title: 'Obyte Headless Wallet Assets',
      caption: 'Assets issued by your Headless Wallet.',
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      assets_view: [
        { name: 'actions', label: '', align: 'left', field: 'unit'},
        { name: 'unit', required: true, label: 'Asset Unit Id', align: 'right', field: 'unit', classes: 'mono' },
      ],
      assets: []
    }
  },

  methods: {
    async getAssets () {
      try {
        const response = await api().get('assets/')
        if (response.status === 200) {
          this.assets = response.data
        }
      }
      catch (err) { notify.processError(err) }
    },

    async viewAsset (asset) {
      let assetURL = this.hwObyteNet + asset.unit
      window.open(assetURL, 'obyteAsset');
    }
  },

  async mounted () {
    await this.getAssets();
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }

}
</script>
<style>
.mono { font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; }
</style>
