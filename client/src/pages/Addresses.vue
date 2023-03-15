<template>
  <q-page class=" q-pa-md " >
    <wf-title :title='title' :caption='caption' />

    <div >
      <q-card-section style='max-width: 800px' >
        <q-table
          :data=' customers '
          :columns=' customers_view '
          :rows-per-page-options="[10]"
        >
          <q-td slot="body-cell-actions" slot-scope="props" :props="props">
            <q-btn size='xs' round color="primary" icon="visibility"
              @click.stop='viewCustomer(props.row)'  />
          </q-td>

        </q-table>
      </q-card-section>

    </div>

  </q-page>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  name: 'CustomersPage',

  data () {
    return {
      title: 'Obyte Headless Wallet Addresses',
      caption: 'List of Obyte Headless Wallet Addresses, excluding 1st address & change address.',
      hwObyteNet: `https://${(process.env.DEV ? 'testnet': '')}explorer.obyte.org/#`,
      customers_view: [
        { name: 'actions', label: '', align: 'justify', field: 'address'},
        { name: 'address_index', label: 'Address Index', field: 'address_index' },
        { name: 'address', required: true, label: 'Wallet Address', align: 'right', field: 'address', classes: 'mono' },
        { name: 'creation_date', required: true, label: 'Creation Date', field: 'creation_date', align: 'right', sortable: true },
      ],
      customers: []
    }
  },

  methods: {
    async walletInfo () {
      try {
        const response = await api().get('addresses/')
        if (response.status === 200) {
          console.log('response:', response.data )
          this.customers = response.data
        }
      }
      catch (err) { notify.processError(err) }
    },

    async viewCustomer (customer) {
      let customerWalletURL = this.hwObyteNet + customer.address
      window.open(customerWalletURL, 'customerWallet');
    }
  },

  async mounted () {
    await this.walletInfo();
  },

  components: {
    'wf-title': require('components/shared/headers/Title.vue').default,
  }

}
</script>
<style>
.mono { font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace; }
</style>
