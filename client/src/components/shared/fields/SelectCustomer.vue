<template>
  <div style="width: 488px" class="q-mr-sm q-mt-sm" >
    <q-select v-if='!readonly && required'
      dense outlined
      :label="formated_label"
      :options="options"
      emit-value map-options
      :value='data' @input="$emit('update:data', $event)"
      hide-bottom-space lazy-rules
      :rules="[val => !!val || 'Field is required']" />

    <q-select v-if='!readonly && !required'
      dense outlined
      :label="formated_label"
      :options="options"
      emit-value map-options
      :value='data' @input="$emit('update:data', $event)"
      hide-bottom-space />

    </div>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  props: [ 'data', 'required', 'label', 'readonly'],

  data () {
    return {
      addresses: []
    }
  },

  async mounted () {
    try {
      let result = await api().get('addresses')
      this.addresses = result.data
      console.log('customers:', this.addresses)
    }
    catch (err) {
      console.log('error: ', err);
      notify.processError(err);
    }
  },

  computed: {
    formated_label() {
      let formated_label = this.label
      if (this.required) formated_label += ' *'
      return formated_label;
    },

    options () {
      let list = []

      this.addresses.forEach((row) => {
        let option = {
          label: row.address,
          value: row.address
        }
        list.push(option)
      })
      return list
    }
  },
}
</script>
