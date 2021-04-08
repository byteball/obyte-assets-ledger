<template>
  <div>
    <div v-if='banner' :style="style" >
      <q-input readonly borderless dense :label='label' :value='data' />
    </div>
    <div v-if='!banner' :style="style" class="q-mr-sm q-mt-sm" >
      <q-input
        v-if='!read && required'
        :label="formated_label"
        :maxlength='maxlength'
        outlined dense
        type='text'
        :mask='mask'
        :value='data' @input="$emit('update:data', $event)"
        lazy-rules hide-bottom-space
        :rules="[ val => validateField(val) || errorMessage ]" />

      <q-input
        v-if='!read && !required'
        :label="formated_label"
        :maxlength='maxlength'
        outlined dense
        type='text'
        :mask='mask'
        :value='data' @input="$emit('update:data', $event)"
        hide-bottom-space />

      <q-input
        v-if="read"
        readonly :label='formated_label' outlined dense :value='data' />
    </div>
  </div>
</template>

<script>
export default {
  props: ['label', 'data', 'required', 'read', 'maxlength', 'mask', 'doublewidth', 'size', 'banner' ],

  data () {
    return {
      errorMessage: ''
    }
  },

  computed: {
    formated_label() {
      let formated_label = this.label
      if (this.required) formated_label += ' *'
      return formated_label;
    },
    style () {
      if (this.size==='small') return "width: 120px"
      if (this.size==='medium') return "width: 180px"
      if (this.doublewidth) return "width: 488px"
      return "width: 240px"
    }
  },

  methods: {
    validateField (val) {
      if (this.required && !val) {
        this.errorMessage = 'Field is required'
        return false
      }
      else return true
    }
  }

}
//
// USED IN :
// CustodyPostingPage.vue
//
</script>
<style>
</style>
