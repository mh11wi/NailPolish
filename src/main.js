import Vue from 'vue'
import App from './App.vue'

// Bootstrap-Vue
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faInfoCircle, faPencilAlt, faTrashAlt, faCheck, faChevronCircleLeft, faChevronCircleRight, faArrowLeft, faArrowRight, faTimes, faSun, faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faInfoCircle, faPencilAlt, faTrashAlt, faCheck, faChevronCircleLeft, faChevronCircleRight, faArrowLeft, faArrowRight, faTimes, faSun, faQuestionCircle)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Custom styling for Bootstrap
import "./assets/scss/custom.scss";
Vue.use(BootstrapVue)

// Image Comparison Slider
import {
  applyPolyfills,
  defineCustomElements,
} from 'img-comparison-slider/loader';

Vue.config.productionTip = false;
Vue.config.ignoredElements = [/test-\w*/];

applyPolyfills().then(() => {
  defineCustomElements(window);
});

// Mount the app
new Vue({
  render: h => h(App),
}).$mount('#app')
