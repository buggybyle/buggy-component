<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  import * as utils from '../assets/js/utils';
  import bug_icon_image from '../assets/images/icons/bug.svg';
  import face_icon_image from '../assets/images/icons/face.svg';
  import idea_icon_image from '../assets/images/icons/idea.svg';
  import rocket_emoji_image from '../assets/images/emojis/rocket.svg';
  import loader_image from '../assets/images/loader.gif';

	// exports

  export let api_key = ``;

	// consts

	const IN_MAINTENANCE = false;
	const SUBMISSION_BODY_MIN_LENGTH = 3;
	const SUBMISSION_BODY_MAX_LENGTH = 150;

	let SUBMISSION_TYPES = [];

	// vars

	let is_active = false;
	let is_toggled = false;
	let data;
	let project;
	let theme = `dark`; // <`dark`, `light`, ...>
	let x_position = `right`; // <`left`, `right`>
	let x_offset_px = 0;
	let y_position = `bottom`; // <`top`, `bottom`>
	let y_offset_px = 0;
	let submission_input = {
		type: `bug`,
		body: ``
	}
	let view = `main`; // <`main`, `submitted`>
	let new_submission;

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

		resetSubmissionInput();

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

			if (data && data.project && data.project.id) {
				SUBMISSION_TYPES = data.SUBMISSION_TYPES || [];
				
				Object.freeze(SUBMISSION_TYPES);

				project = utils.clone(data) || null;

				if (project && project.id) {
					let component_config = project.component_config || {};
					theme = component_config.theme || `dark`;
					x_position = component_config.x_position || `right`;
					x_offset_px = component_config.x_offset_px || 0;
					y_position = component_config.y_position || `bottom`;
					y_offset_px = component_config.y_offset_px || 0;
				}
			} else if (data) {
				console.error(`Error when loading Buggy.so component: ${data}`);
			} else {
				console.error(`Unknown error when loading Buggy.so component.`);
			}

			jobs = jobs.filter(j => j !== `get_data`);
		} catch (e) {
			console.log(e);
		}
	}

	// execs
	// none

	// funcs
	
	function resetSubmissionInput() {
		try {
			submission_input.type = `bug`;
			submission_input.body = ``;
		} catch (e) {
			console.log(e);
		}
	}
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
		{#if is_toggled}
			<!-- main -->
			<div
				class="container  stretch--  col--  card  b-main">
				{#if view === `submitted`}
					<!-- main (submitted) -> submitted -->
					<div class="container  stretch--  col--  b-ma__submitted">
						{#if new_submission && new_submission.id}
							<!-- main (submitted) -> submitted (successful) -> heading -->
							<div class="container  stretch--  row--  row-left--  row-wrap--  b-ma__su-heading">
								<div>Your {(SUBMISSION_TYPES.find(T => T.code === submission_input.type) || {}).name || `submission`} has been submitted.</div>
								<img
									src={rocket_emoji_image}
									alt=""
								/>
							</div>
							
							<!-- main (submitted) -> submitted (successful) -> subheading -->
							<div class="b-ma__su-subheading">Submitted anonymously.</div>
						{:else}
							<!-- main (submitted) -> submitted (unsuccessful) -> heading -->
							<div class="container  stretch--  row--  row-left--  row-wrap--  b-ma__su-heading">
								<div>Unable to submit your {(SUBMISSION_TYPES.find(T => T.code === submission_input.type) || {}).name || `submission`}.</div>
							</div>
							
							<!-- main (submitted) -> submitted (unsuccessful) -> subheading -->
							<div class="b-ma__su-subheading">Contact staff if this issue persists.</div>
						{/if}
					</div>

					<!-- main (submitted) -> buttons -->
					<div class="container  stretch--  row--  row-wrap--  b-ma__buttons">
						{#if new_submission && new_submission.id}
						<!-- main (submitted) -> button (claim) -->
							<a
								href="https://buggy.so/submission/claim?id={new_submission.id || ``}"
								class="container  grow--  row--  row-centre--  text  text-yellow--  card  yellow--  b-ma__button"
							>
								<div>
									Claim it
									<span class="text  text-white--">
										{`on Buggy.so >`}
									</span>
								</div>
							</a>
						{/if}

						<!-- main (submitted) -> button (close) -->
						<div
							class="container  row--  row-centre--  text  text-red--  card  red--  b-ma__button"
							on:click|stopPropagation={() => {
								try {
									view = `main`;
									new_submission = null;
									resetSubmissionInput();
								} catch (e) {
									console.log(e);
								}
							}}
						>
							<div>x Close</div>
						</div>
					</div>
				{:else}
					<!-- note: view === `main` -->
					<!-- main -> top -->
					<div class="container  stretch--  row--  row-left--  b-ma__top">
						<!-- main -> top -> options -->
						<div class="container  grow--  row--  row-left--  b-ma__to-options">
							{#each SUBMISSION_TYPES as TYPE}
								<!-- option -->
								<div
									class="container  row--  row-centre--  text  text-{TYPE.colour}--  b-ma__to-option"
									class:b-selected--={TYPE.code === submission_input.type}
									on:click={() => {
										try {
											submission_input.type = utils.clone(TYPE).code || ``;
										} catch (e) {
											console.log(e);
										}
									}}
								>
									{#if TYPE === `bug`}
										<img
											src={bug_icon_image}
											alt=""
											class="svg  svg-{TYPE.colour}--"
										/>
									{:else if TYPE === `idea`}
										<img
											src={idea_icon_image}
											alt=""
											class="svg  svg-{TYPE.colour}--"
										/>
									{/if}

									<div>{TYPE.name || `n/a`}</div>
								</div>
							{/each}
						</div>

						<!-- main -> top -> count -->
						<div class="b-ma__to-count">
							{(submission_input.body || ``).trim().length || 0}/{SUBMISSION_BODY_MAX_LENGTH || 0}
						</div>
					</div>

					<!-- main -> input (body) -->
					<input
						type="text"
						bind:value={submission_input.body}
						placeholder="Type your {(SUBMISSION_TYPES.find(T => T.code === submission_input.type) || {}).name || `submission`}"
						class="container  grow--  stretch--  col--  b-ma__input"
						maxlength={SUBMISSION_BODY_MAX_LENGTH || 0}
					/>

					<!-- main -> submit -->
					<div
						class="container  row--  row-centre--  card  b-ma__submit"
						class:disabled={!(SUBMISSION_TYPES.some(T => T.code === submission_input.type) && ((submission_input.body || ``).trim().length >= SUBMISSION_BODY_MIN_LENGTH))}
						on:click={() => {
							try {
								if (!jobs.includes(`submit`)) {
									jobs.push(`submit`);
									jobs = jobs;

									// tba: adhoc->component_submit --- get resulting new_submission || null

									jobs = jobs.filter(j => j !== `submit`);
								}
							} catch (e) {
								console.log(e);
							}
						}}
					>
						<div>
							{#if jobs.includes(`submit`)}
								<img
									src={loader_image}
									alt=""
								/>
							{:else}
								Submit
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- toggle -->
		<div
			class="container   row--  row-centre--  card  b-toggle"
			on:click={() => {
				try {
					is_toggled = !is_toggled;
				} catch (e) {
					console.log(e);
				}
			}}
		>
			<!-- toggle -> face -->
			<img
				src={face_icon_image}
				alt=""
				class="svg  svg-white--  b-to__face"
			/>

			<!-- toggle -> idea -->
			<img
				src={idea_icon_image}
				alt=""
				class="svg  svg-yellow--  b-to__idea"
			/>
		</div>
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

	// main

	.b-main.card {
		// tba
	}

	// main -> submitted

	.b-ma__submitted {
		// tba
	}

	.b-ma__su-heading {
		// tba

		> div {
			// tba
		}

		> img {
			// tba
		}
	}

	.b-ma__su-subheading {
		// tba
	}

	// main -> buttons

	.b-ma__buttons {
		// tba
	}

	// main -> button
	
	.b-ma__button.card {
		// tba

		> div {
			// tba
		}
	}

	// main -> top

	.b-ma__top {
		// tba
	}

	.b-ma__to-options {
		// tba
	}

	.b-ma__to-option {
		// tba

		> img {
			// tba
		}

		> div {
			// tba
		}

		&.b-selected-- {
			// tba
		}
	}

	.b-ma__to-count {
		// tba
	}

	// main -> input

	.b-ma__input {
		// tba
	}

	// main -> submit

	.b-ma__submit.card {
		// tba

		> div {
			// tba
		}
	}

	// toggle

	.b-toggle.card {
		// tba
	}

	// toggle -> face

	.b-to__face {
		// tba
	}

	// toggle -> idea

	.b-to__idea {
		// tba
	}
</style>