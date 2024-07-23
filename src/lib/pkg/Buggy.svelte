<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  import * as utils from '../assets/js/utils';
  import bug_icon_image from '../assets/images/icons/bug.svg';
  import idea_icon_image from '../assets/images/icons/idea.svg';
  import rocket_emoji_image from '../assets/images/emojis/rocket.svg';

	// exports

  export let api_key = ``;

	// consts

	const IN_MAINTENANCE = false;

	// vars

	let is_active = false;
	let data;
	let project;
	let theme = `dark`; // <`dark`, `light`, ...>
	let x_position = `right`; // <`left`, `right`>
	let x_offset_px = 0;
	let y_position = `bottom`; // <`top`, `bottom`>
	let y_offset_px = 0;

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

			data = await api.restPost({
				url: `load`,
				payload: {
					type: `component_main`,
					obj: {
						origin_url: window.location || ``,
						project_api_key: api_key || ``
					}
				}
			}) || null;

			if (data) {
				project = utils.clone(data) || null;

				if (project && project.id) {
					let component_config = project.component_config || {};
					theme = component_config.theme || `dark`;
					x_position = component_config.x_position || `right`;
					x_offset_px = component_config.x_offset_px || 0;
					y_position = component_config.y_position || `bottom`;
					y_offset_px = component_config.y_offset_px || 0;
				}
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
  data &&
	project &&
	project.id
}
  <!-- buggy -->
  <div
		class="container  col--  buggy  b-{theme}--  b-{y_position}-{x_position}--"
		style="
			margin-left: {x_offset_px};
			margin-top: {y_offset_px};
		"
	>
		<!-- main -->
		<!-- tba -->

		<!-- bottom -->
		<!-- tba -->
  </div>
{/if}
 
<style lang="scss">
	@import '../assets/scss/all.scss';

  // buggy
  .buggy.card {
		@include hover-forward(1.04);
    position: fixed;
    padding: 0.35em 0.6em 0.3em;
    --bg-a1: 1;
    --bg-a2: 1;
    --bd-w: 0.13em;
		
		&.b-dark-- {
			// tba
		}

		&.b-light-- {
			// tba
		}

		&.b-top-left-- {
			top: 2em;
			left: 2em;
			bottom: unset;
			right: unset;
		}

		&.b-top-right-- {
			top: 2em;
			left: unset;
			bottom: unset;
			right: 2em;
		}

		&.b-bottom-left-- {
			top: unset;
			left: 2em;
			bottom: 2em;
			right: unset;
		}

		&.b-bottom-right-- {
			top: unset;
			left: unset;
			bottom: 2em;
			right: 2em;
		}
  }
</style>