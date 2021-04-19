<template>
  <div style="width: 488px" class="q-mr-sm q-mt-sm" >
    <q-select v-if='!readonly'
      dense outlined
      :label="formated_label"
      :options="options"
      emit-value map-options
      :value='data' @input="$emit('update:data', $event)"
      hide-bottom-space lazy-rules
      :rules="[val => !!val || 'Field is required']" />

    </div>
</template>

<script>
import api from 'src/services/api'
import notify from 'src/components/shared/messages/notify'

export default {
  props: [ 'data', 'required', 'label', 'readonly', 'includeBase'],

  data () {
    return {
      assets: []
    }
  },

  async mounted () {
    try {
      let result = await api().get('assets')
      this.assets = result.data
      console.log('assets:', this.assets)
    }
    catch (err) {
      console.error('error:', err);
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
      if (this.includeBase) list.push({ label: 'Obyte Bytes', value: 'base'})
      this.assets.forEach((row) => {
        let option = {
          label: row.unit,
          value: row.unit
        }
        list.push(option)
      })
      return list
    }
  },
}
</script>
