import Vue from 'vue'
import App from './App.vue'

import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faHome, faPencilAlt, faTrashAlt, faCheck, faArrowLeft, faArrowRight, faTimes, faSun } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faInfoCircle, faHome, faPencilAlt, faTrashAlt, faCheck, faArrowLeft, faArrowRight, faTimes, faSun)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import "./assets/scss/custom.scss";

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import {
  applyPolyfills,
  defineCustomElements,
} from 'img-comparison-slider/loader';

Vue.config.productionTip = false;

// Tell Vue to ignore all components defined in the test-components
// package. The regex assumes all components names are prefixed
// 'test'
Vue.config.ignoredElements = [/test-\w*/];

// Bind the custom elements to the window object
applyPolyfills().then(() => {
  defineCustomElements(window);
});

new Vue({
  render: h => h(App),
}).$mount('#app')
