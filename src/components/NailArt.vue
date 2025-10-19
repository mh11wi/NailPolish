<template>
  <b-row class="mb-3 entry">
    <b-col cols="9" sm="5" lg="4" offset-xl="1">
      <b-img-lazy 
        :src="getImage(entry.id)" 
        :alt="entry.alt"
        fluid
        blank-color="black"
      />
    </b-col>
    <b-col cols="12" sm="7" xl="6">
      <div class="details pt-2 pt-sm-0">
        <p><strong>{{ entry.date }}</strong></p>
        <p>{{ entry.description }}</p>
        <p class="text-underline mb-1">Polishes Used</p>
        <ul>
          <li v-for="(polish, index) in entry.polishes" :key="index">
            <span v-if="!polish.id">
              <strong>{{ polish.brand }}</strong> - {{ polish.name }}
            </span>
            <div v-else>
              <strong>{{ polishes[polish.id - 1].brand }}</strong> - {{ polishes[polish.id - 1].name }}
              <b-link :id="entry.id + '_' + polish.id" tabindex="0" aria-label="See polish">
                <font-awesome-icon icon="question-circle"/>
              </b-link>
              <b-popover 
                :target="entry.id + '_' + polish.id"
                triggers="click blur"
				container="gallery"
                custom-class="hidden"
                @shown="positionPopover"
                @hide="hidePopover"
              >
                <b-img-lazy
                  :src="getPolishImage(polish)" 
                  :alt="polishes[polish.id - 1].name" 
                  width=200 
                  blank-color="black"
                />
              </b-popover>
            </div>
          </li>
        </ul>
      </div>
    </b-col>
  </b-row>
</template>

<script>
/** A nail art entry to display in the gallery, with popovers to illustrate the polishes used. */
export default {
  name: 'NailArt',
  props: [
    'entry', // data of the nail art entry
    'polishes' // data of all polishes
  ],
  methods: {
    /**
     * Gets the specified nail art image.
     * @param id - the id of the nail art entry
     */
    getImage(id) {
	  return new URL(`../assets/images/nailart/${id}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
    },
    
    /**
     * Gets the specified polish image. If the polish is a topper, it will be shown over the specifed base polish.
     * @param polish - information about the polish
     */
    getPolishImage(polish) {
      if (polish.base) {
		return new URL(`../assets/images/polishes/${polish.base}/${polish.id}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
      }

	  return new URL(`../assets/images/polishes/${polish.id}/${import.meta.env.VITE_GLOSSY}${import.meta.env.VITE_EXTENSION}`, import.meta.url).href;
    },
    
    /**
     * Positions the popover beside the target, taking the page scale into account.
     * @param event - object containing the target and popover elements
     */
    positionPopover(event) {
      const html = document.querySelectorAll('html')[0];
      const matrix = window.getComputedStyle(html).transform;
      const matrixArray = matrix.replace("matrix(", "").split(",");
      const scale = parseFloat(matrixArray[0]);

      const rect = event.target.getBoundingClientRect();
      const { innerHeight, innerWidth } = window;
      const popoverWidth = 225 * scale;
      const popoverHeight = 218.125 * scale;
      
      let left = rect.right;
      let right = left + popoverWidth;
      let top = rect.top - (popoverHeight / 2);
      let bottom = top + popoverHeight;
      
      if (right > innerWidth) {
        left = innerWidth - popoverWidth - 8;
      }
      
      const header = 110 * scale;
      if (top < header) {
        top = header;
      }
      
      if (bottom > innerHeight) {
        top = innerHeight - popoverHeight;
      }

      const popover = event.relatedTarget;
      popover.style.transform = `translate(${left / scale}px, ${top / scale}px)`;
      
      const arrow = popover.querySelector('.arrow');
      const arrowTop = rect.top - top - 3;
      arrow.style.top = `${arrowTop / scale}px`;
      
	  popover.classList.remove('hidden');
    },
    
    /**
     * Immediately hides the popover.
     * @param event - object containing the target and popover elements
     */
    hidePopover(event) {
	  const parent = event.relatedTarget.parentElement;
	  if (parent.hasAttribute('data-v-app')) {
		parent.remove();
	  } else {
        event.relatedTarget.classList?.add('hidden');
	  }
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@media (orientation: landscape) {
  .details {
    padding-right: 3rem;
  }
}

.text-underline {
  text-decoration: underline;
}

ul {
  padding-left: 1rem;
}

ul, p {
  margin-bottom: 0.5rem;
}

.popover {
  min-width: 200px;
}
</style>
