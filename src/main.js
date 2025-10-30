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

Vue.mixin({
  data: function() {
    return {
	  placeholderColor: import.meta.env.VITE_PLACEHOLDER_COLOR,
      showFinishToggle: import.meta.env.VITE_FINISH_TOGGLE == 'true'
    }
  },
  methods: {
    handleImageError(event) {
	  event.target.src = `data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%221%22%20height%3D%221%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20%25%7Bw%7D%20%25%7Bh%7D%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20style%3D%22fill%3A${import.meta.env.VITE_PLACEHOLDER_COLOR}%3B%22%3E%3C%2Frect%3E%3C%2Fsvg%3E`;
	},
	pluck: function(array, key) {
      return [...new Set(array.map(o => o[key].length > 0 ? o[key] : null))].sort();
    },
	hideOrRemoveParent(event) {
	  const parent = event.relatedTarget.parentElement;
	  if (parent.hasAttribute('data-v-app')) {
		parent.remove();
	  } else {
        event.relatedTarget.classList?.add('hidden');
	  }
    }
  }
})

// Mount the app
new Vue({
  render: h => h(App),
}).$mount('#app')
