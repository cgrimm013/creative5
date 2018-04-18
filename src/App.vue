<template>
  <div id="app">
    <app-header/>
    <router-view/>
    <footer>
      <a href="https://github.com/cgrimm013/creative5">Github Repo</a>
    </footer>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
export default {
  name: 'App',
  components: {AppHeader}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;

}


body {
  font-family: 'Lora', serif;
  margin-bottom: 50px !important;
  color: #35495e;
  background-color: #F5F5F5;
  margin-left: 100px;
  margin-right: 100px;
}

h1{
  color: #42b883;
  margin-bottom: 0px;
  font-size: 3em;
}

.remove{
  display: inline;
  float: right;
}

.description{
  color: #35495e;
}

p {
  color: #35495e;
}

input{
  margin-top: 10px;
}

.disclaimer{
  color: red;
  font-size: 10px;
  width: 50%;
  margin: auto;
  border: 2px solid red;
  padding: 5px;
  margin-top: 10px;
}

.flex-container {
  display: flex;
  justify-content: center;
}

.flex-item {
  width: 49%;
  padding: 10px
}

.image{
  max-width: 100%
}

.left-border {
  border-left: 2px solid #42b883
}

.center {
  text-align: center;
  width: 70%;
  margin: auto
}

</style>
