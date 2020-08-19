import Vue from 'vue'
import App from './App.vue'
import Scheduler from './Scheduler.vue'
new Vue({
  el: '#app',
  render: h => h(window.scheduler ? Scheduler : App)
})