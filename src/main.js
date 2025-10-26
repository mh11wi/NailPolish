import Vue from 'vue'
import App from './App.vue'

// Bootstrap-Vue
import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { 
  faInfoCircle,
  faBars,
  faPencilAlt, 
  faTrashAlt, 
  faSearch, 
  faCheck, 
  faChevronDown,
  faChevronUp,
  faChevronCircleLeft, 
  faChevronCircleRight, 
  faArrowLeft, 
  faArrowRight, 
  faTimes, 
  faSun, 
  faMoon, 
  faBan,
  faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(
  faInfoCircle,  
  faBars,
  faPencilAlt, 
  faTrashAlt, 
  faSearch, 
  faCheck, 
  faChevronDown,
  faChevronUp,
  faChevronCircleLeft, 
  faChevronCircleRight, 
  faArrowLeft, 
  faArrowRight, 
  faTimes, 
  faSun, 
  faMoon, 
  faBan, 
  faQuestionCircle
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Custom styling for Bootstrap
import "./assets/scss/custom.scss";
Vue.use(BootstrapVue)

// Image Comparison Slider
import 'img-comparison-slider';

Vue.config.productionTip = false;

// Tell Vue that the web component is present.
Vue.config.ignoredElements = [/img-comparison-slider/];

// Mount the app
new Vue({
  render: h => h(App),
}).$mount('#app')
