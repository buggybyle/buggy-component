<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  import * as utils from '../assets/js/utils';

	// exports

  export let d; // {text}

	// consts

	const IN_MAINTENANCE = false;

	// vars

	let is_active = false;

	// dynamics
	// none

	// mount

	onMount(async () => {
		if (IN_MAINTENANCE) {
			return;
		}
		
		if (!is_active) {
			is_active = true;
		}
	});

	onDestroy(() => {
		try {
			is_active = false;	
		} catch (e) {
			console.log(e);
		}
	});

	// jobs
  // none

	// execs
	// none

	// funcs
	// none
</script>

{#if
	!IN_MAINTENANCE &&
	d
}
	<!-- sampletext -->
	<div class="sampletext">
		{d.text || `No text...`}
	</div>
{/if}
 
<style lang="scss">
	@import '../assets/scss/all.scss';

	// sampletext
	.sampletext {
		font-size: 1em;
	}
</style>