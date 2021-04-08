<template>
  <div style="width: 240px" class="q-mr-sm">
    <div class="q-pr-md q-pt-sm ">
      <q-toggle v-if='!read'
        dense inline
        :label='label'
        :checked-icon='checked_image'
        :color='color'
        :unchecked-icon='unchecked_image'
        :value='data' @input="$emit('update:data', $event)"
        hide-bottom-space
      />
      <q-toggle v-if='read'
        readonly
        dense inline
        :label='label'
        :checked-icon='checked_image'
        :color='color'
        :unchecked-icon='unchecked_image'
        :value='data'
        hide-bottom-space
      />
    </div>
  </div>
</template>

<script>

export default {
  props: [ 'data', 'required', 'label', 'checked_icon', 'unchecked_icon', 'color', 'read' ],

  computed: {
    checked_image () {
      if (this.checked_icon) return this.checked_icon
      else return "check"
    },
    unchecked_image () {
      if (this.unchecked_icon) return this.unchecked_icon
      else return "clear"
    }
  },

}
//
// used in: UserModal.vue, PriceAddEditPage.vue
//
</script>
