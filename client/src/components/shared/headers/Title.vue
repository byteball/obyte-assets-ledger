<template>
  <div>
    <div class='row'>
      <div class="text-h6">{{ title }}</div>
      <q-space />
      <q-btn v-if='back_arrow' class='q-ml-sm' size='sm'
        flat color="grey" round icon="arrow_back" @click='back()'/>
    </div>

    <div class="row q-pb-md">
      <div class="text-caption">{{ caption }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'caption', 'back_arrow', 'back_arrow_to', 'level'],

  methods: {
    back () {
      if (!this.back_arrow_to) {
        if (!this.level) this.$root.$emit('goBack')
        else this.$root.$emit('goBackLevel' + this.level)
      } else {
        this.$router.push(this.back_arrow_to)
      }
    }
  }
}
</script>
