<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  // import * as utils from '../assets/js/utils';
  import SampleText from '../components/SampleText.svelte';
  import sample_image from '../assets/images/sample.png';

	// exports

  export let sample_text = `Sample text`;

	// consts

	const IN_MAINTENANCE = false;

	// vars

	let is_active = false;
	let data;
	let user;

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

		await getData();
	});

	onDestroy(() => {
		try {
			is_active = false;	
		} catch (e) {
			console.log(e);
		}
	});

	// jobs

	let jobs = [`get_data`];

	async function getData() {
		try {
			jobs.push(`get_data`);
			jobs = jobs;

			user = await api.getCurrentUser() || null;

			if (!(user && user.id)) {
				user = null;
			}

			data = await api.restPost({
				url: `load`,
				payload: {
					type: `component_sample`, // note: returns `{text}` as defined in ollesocket->adhoc
					obj: {
						sample_var: sample_text || ``
					}
				}
			}) || null;

			if (data) {
				// todo: data
			}

			jobs = jobs.filter(j => j !== `get_data`);
		} catch (e) {
			console.log(e);
		}
	}

	// execs
	// none

	// funcs
	// none
</script>

{#if
  !IN_MAINTENANCE &&
  !jobs.includes(`get_data`) &&
  data
}
  <!-- ollesvege -->
  <div class="container  row--  row-centre--  text  text-black--  card  white--  ollesvege">
    <!-- image -->
    <img
      src={sample_image}
      alt=""
      class="o-image"
    />

    <!-- sampletext -->
    <SampleText
      d={{
        text: (data || {}).text || ``
      }}
    />
  </div>
{/if}
 
<style lang="scss">
	@import '../assets/scss/all.scss';

  // ollesvege
  .ollesvege.card {
		@include hover-forward(1.04);
    position: fixed;
    top: unset;
    left: unset;
    bottom: 2em;
    right: 2em;
    padding: 0.35em 0.6em 0.3em;
    --bg-a1: 1;
    --bg-a2: 1;
    --bd-w: 0em;
  }

  // image
  .o-image {
    height: 1em;
    margin-right: 0.3em;
  }
</style>