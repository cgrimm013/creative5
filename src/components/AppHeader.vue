<template>
<div>
  <div v-if='loggedIn'>
    <button class="right" v-on:click='logout'>Logout</button>
  </div>
  <div v-else>
    <form class="right" v-on:submit.prevent="login">
      <input v-model="email" placeholder="Email Address">
      <input v-model="password" type="password" placeholder="Password">
      <button class="primary" type="submit">Login</button>
    </form>
  </div>
  <br />
  <h1>WebsiteGen 2.0</h1>
  <h3>Ever stuck on what to do for your next project? Be stuck no more! With WebsiteGen 2.0, you can automatically generate some new ideas for your next website and keep them all stored in your account.</h3>
</div>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  computed: {
    loggedIn: function(){
      return this.$store.getters.loggedIn
    }
  },
  methods: {
    login: function() {
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password,
      }).then(user => {
        this.email = '';
        this.password = '';
      });
    },
    logout: function(){
      this.$store.dispatch('logout')
    }
  }
}
</script>

<style scoped>
.right {
  float: right;
}
</style>
