<template>
<div>
  <form v-on:submit.prevent="newIdea">
    <label class="description">Click the picture to discover a magical topic for your next website!</label>
    <br />
    <input type="image" src="/static/images/funbegins.jpg" alt="Look for ideas">
  </form>

  <div class="disclaimer">
    DISCLAIMER:
    <br /> This grabs a picture based on the noun that is discovered and comes with no warranty of any kind. We are not liable for any scarring to the extent of applicable law.
  </div>

  <idea-list/>

</div>
</template>

<script>
import IdeaList from './IdeaList'
export default {
  name: 'UserView',
  components: {
    IdeaList
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    newIdea: function() {
      this.getWord('adjective', (adj) => {
        console.log(adj);
        this.getWord('noun', (noun) => {
          console.log(noun);
          this.getImage(noun.word, (image) => {
            let idea = {
              img: image.items[0].link,
              adj: adj.word,
              adjDef: adj.results[0].definition,
              noun: noun.word,
              nounDef: noun.results[0].definition
            }
            this.$store.dispatch('addIdea', idea)
          });
        });
      });
    },
    getImage: function(word, callback) {
      let url = `https://www.googleapis.com/customsearch/v1?q=${word}&cx=010548783614037141903%3Ahdf4ddxx1te&searchType=image&key=AIzaSyAbdOEe7mYFI6WaH5OhAK0gRows3N2o9gQ`;
      fetch(url).then(response => {
        return response.json();
      }).then(callback).catch(err => {
        console.error(err);
      })
    },
    getWord: function(type, callback) {
      var request = new Request('https://wordsapiv1.p.mashape.com/words/?random=true&partOfSpeech=' + type, {
        headers: new Headers({
          'X-Mashape-Key': '77yWeQAGnkmshkalv20vVEFDxA2mp1ZLnoOjsnwyNmfg9dZFR0',
          'X-Mashape-Host': 'wordsapiv1.p.mashape.com'
        })
      });
      fetch(request).then(response => {
        return response.json()
      }).then(callback).catch(err => {
        console.error(err);
      })
    },
  }
}
</script>

<style scoped>
.disclaimer {
  color: red;
  font-size: 10px;
  width: 50%;
  margin: auto;
  border: 2px solid red;
  padding: 5px;
  margin-top: 10px;
}
</style>
