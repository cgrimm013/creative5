<template>
  <div>
    <div v-for="idea in ideas">
      <hr>
      <button class="right" v-on:click="removeIdea(idea)">Remove Idea</button>
      <br />
      <img class="image" v-bind:src="idea.img" alt="An Awesome Picture"/>
      <h3>{{idea.adj}} {{idea.noun}} </h3>
      <br />
      <div class="flex-container">
        <div class="flex-item">
          <h4>{{idea.adj}} (adjective)</h4>
          <p>
            {{idea.adjDef}}
          </p>
        </div>
        <div class="flex-item left-border">
          <h4>{{idea.noun}} (noun)</h4>
          <p>
            {{idea.nounDef}}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdeaList',
  data() {
    return {
    }
  },
  computed: {
    ideas: function() {
      return this.$store.getters.ideas;
    },
  },
  created: function(){
    this.$store.dispatch('getIdeas')
  },
  methods: {
    removeIdea: function(idea){
      console.log("Removing Idea: ", idea);
      this.$store.dispatch('removeIdea', idea)
    }
  }
}
</script>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
}

.flex-item {
  width: 49%;
  padding: 10px
}

.image{
  max-width: 500px;
  max-height: 500px
}

.left-border {
  border-left: 2px solid #42b883
}

.center {
  text-align: center;
  width: 70%;
  margin: auto
}

.right{
  float: right;
}


</style>
