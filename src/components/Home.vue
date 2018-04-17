<template>
<div>
  <div v-if="loggedIn">
    <user-view/>
  </div>
  <div v-else>
    <register/>
  </div>
</div>
</template>

<script>
import UserView from './UserView'
import Register from './Register'
export default {
  name: 'Home',
  components: {
    UserView,
    Register
  },
  data() {
    return {}
  },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
  },
  methods: {}
}
</script>

<style scoped>


</style>
