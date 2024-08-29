<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  import * as utils from '../assets/js/utils';
  import bug_icon_image from '../assets/images/icons/bug.svg';
  import face_icon_image from '../assets/images/icons/face.svg';
  import idea_icon_image from '../assets/images/icons/idea.svg';
  import rocket_emoji_image from '../assets/images/emojis/rocket.png';
  import loader_image from '../assets/images/loader.gif';

	// exports

  export let api_key = ``;

	// consts

	const IN_MAINTENANCE = false;
	const DEFAULT_SUBMISSION_BODY_MIN_LENGTH = 3;
	const DEFAULT_SUBMISSION_BODY_MAX_LENGTH = 150;

	let SUBMISSION_TYPES = [];

	// vars

	let is_active = false;
	let is_toggled = false;
	let data;
	let project;
	let project_submission_types = [`bug`, `idea`];
	let submission_min_length = DEFAULT_SUBMISSION_BODY_MIN_LENGTH;
	let submission_max_length = DEFAULT_SUBMISSION_BODY_MAX_LENGTH;
	let theme = `dark`; // <`dark`, `light`, ...>
	let x_position = `right`; // <`left`, `right`>
	let x_offset_px = 0;
	let y_position = `bottom`; // <`top`, `bottom`>
	let y_offset_px = 0;
	let submission_input = {
		type: project_submission_types.slice()[0] || ``,
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

		await getData();

		resetSubmissionInput();
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
						origin_url: window.location.origin || ``,
						href_url: window.location.href || ``,
						project_api_key: api_key || ``
					}
				}
			}) || null;

			if (data && data.project && data.project.id) {
				SUBMISSION_TYPES = data.SUBMISSION_TYPES || [];
				
				Object.freeze(SUBMISSION_TYPES);

				project = utils.clone(data.project) || null;

				if (project && project.id) {
					project_submission_types = project.submission_types || [];
					submission_min_length = project.submission_min_length || DEFAULT_SUBMISSION_BODY_MIN_LENGTH;
					submission_max_length = project.submission_max_length || DEFAULT_SUBMISSION_BODY_MAX_LENGTH;

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
			submission_input.type = project_submission_types.slice()[0] || ``;
			submission_input.body = ``;
		} catch (e) {
			console.log(e);
		}
	}
</script>

<!-- tba: image upload section in main view -->
<!-- tba: select custom labels in main view if any available for project -->
<!-- tba: implement in script version of component -->

{#if
  !IN_MAINTENANCE &&
  !jobs.includes(`get_data`) &&
  data &&
	project &&
	project.id
}
  <!-- buggy -->
  <div
		class="container  col--  buggy  b-{y_position}-{x_position}--"
		class:b-toggled--={is_toggled}
		class:col-left--={x_position === `left`}
		class:col-right--={x_position === `right`}
		style="
			margin-left: {x_offset_px};
			margin-top: {y_offset_px};
		"
	>
		{#if is_toggled}
			<!-- main -->
			<div
				class="container  stretch--  col--  text  card  b-main"
				class:text-yellow--={theme === `dark`}
				class:yellow-dark--={theme === `dark`}
				class:text-yellow-dim--={theme === `light`}
				class:white-dim--={theme === `light`}
				class:b-submitted--={view === `submitted`}
			>
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
								target="_blank"
								class="container  grow--  row--  row-centre--  text  card  b-ma__button"
								class:text-white--={theme === `dark`}
								class:yellow-dim--={theme === `dark`}
								class:text-yellow-dim--={theme === `light`}
								class:white-dim--={theme === `light`}
							>
								<div>
									<span class="text  text-yellow--">
										Claim it
									</span>
									{`on Buggy.so >`}
								</div>
							</a>
						{/if}

						<!-- main (submitted) -> button (close) -->
						<div
							class="container  row--  row-centre--  text  text-red--  card  b-ma__button"
							class:red-dim--={theme === `dark`}
							class:white-dim--={theme === `light`}
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
							{#each SUBMISSION_TYPES.filter(T => project_submission_types.some(pst => T.code === pst)) as TYPE}
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
									{#if TYPE.code === `bug`}
										<img
											src={bug_icon_image}
											alt=""
											class="svg  svg-{TYPE.colour}--"
										/>
									{:else if TYPE.code === `idea`}
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
						<div
							class="text  b-ma__to-count"
							class:text-yellow--={theme === `dark`}
							class:text-yellow-dim--={theme === `light`}
						>
							{(submission_input.body || ``).trim().length || 0}/{submission_max_length || DEFAULT_SUBMISSION_BODY_MAX_LENGTH}
						</div>
					</div>

					<!-- main -> input (body) -->
					<textarea
						bind:value={submission_input.body}
						placeholder="Type your {(SUBMISSION_TYPES.find(T => T.code === submission_input.type) || {}).name || `submission`}..."
						class="container  grow--  stretch--  col--  text  b-ma__input"
						class:text-white--={theme === `dark`}
						class:text-yellow-dim--={theme === `light`}
						maxlength={submission_max_length || DEFAULT_SUBMISSION_BODY_MAX_LENGTH}
					/>

					<!-- main -> submit -->
					<div
						class="container  row--  row-centre--  card  b-ma__submit"
						class:text-white--={theme === `dark`}
						class:yellow-dark--={theme === `dark`}
						class:text-yellow-dim--={theme === `light`}
						class:white-dim--={theme === `light`}
						class:disabled={!(SUBMISSION_TYPES.some(T => T.code === submission_input.type) && ((submission_input.body || ``).trim().length >= (submission_min_length || DEFAULT_SUBMISSION_BODY_MIN_LENGTH)))}
						on:click={async () => {
							try {
								if (!jobs.includes(`submit`)) {
									jobs.push(`submit`);
									jobs = jobs;

									let component_submit_res = await api.restPost({
										url: `load`,
										payload: {
											type: `component_submit`,
											obj: {
												project_id: project.id || ``,
												origin_url: window.location.origin || ``,
												href_url: window.location.href || ``,
												type: submission_input.type || ``,
												body: (submission_input.body || ``).trim() || ``,
											}
										}
									}) || null;

									if (component_submit_res) {
										new_submission = utils.clone(component_submit_res);
									} else {
										new_submission = null;
									}

									view = `submitted`;

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
			class:b-toggled--={is_toggled}
			class:text-white--={theme === `dark`}
			class:yellow-dark--={theme === `dark`}
			class:text-yellow-dim--={theme === `light`}
			class:white-dim--={theme === `light`}
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
				class="svg  b-to__face"
				class:svg-white--={theme === `dark`}
				class:svg-yellow-dim--={theme === `light`}
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
	
  .buggy {
		@include hover-forward(1.02);
		@include swish;
    position: fixed;
		font-size: 12px;
		z-index: 100;

		@media (min-width: $bp-sm) {
			font-size: 15px;
		}
		
		&.b-toggled-- {
			.b-main.card {
				width: calc(20em - 1em * 2);
			}
		}

		&.b-top-left-- {
			top: 2em;
			left: 2em;
			bottom: unset;
			right: unset;

			> .b-main.card {
				top: 3.5em;
				left: 0;

				> .b-ma__submit.card {
					bottom: calc(100% + 0.7em);
					right: 0;
				}
			}
		}

		&.b-top-right-- {
			top: 2em;
			left: unset;
			bottom: unset;
			right: 2em;

			> .b-main.card {
				top: 3.5em;
				right: 0;

				> .b-ma__submit.card {
					bottom: calc(100% + 0.7em);
					left: 0;
				}
			}
		}

		&.b-bottom-left-- {
			top: unset;
			left: 2em;
			bottom: 2em;
			right: unset;

			> .b-main.card {
				bottom: 3.5em;
				left: 0;

				> .b-ma__submit.card {
					top: calc(100% + 0.7em);
					right: 0;
				}
			}
		}

		&.b-bottom-right-- {
			top: unset;
			left: unset;
			bottom: 2em;
			right: 2em;

			> .b-main.card {
				bottom: 3.5em;
				right: 0;

				> .b-ma__submit.card {
					top: calc(100% + 0.7em);
					left: 0;
				}
			}
		}
  }

	// main

	.b-main.card {
		position: absolute;
		max-width: calc(20em - 1em * 2);
		padding: 1em;
		height: calc(10em - 1em * 2);
		top: unset;
		bottom: unset;
		left: unset;
		right: unset;
		--bd: #{$yellow};
		--bd-a: 0.15;
		--bg-deg: to bottom;
		@include pulse($yellow-hex);

		&.b-submitted-- {
			height: calc(7em - 1em * 2);
		}

		&:hover {
			--bd-a: 0.3;
		}
	}

	// main -> submitted

	.b-ma__submitted {
		// none
	}

	.b-ma__su-heading {
		// none

		> div {
			font-size: 1.15em;
			padding-right: 0.2em;
		}

		> img {
			height: 1.25em;
		}
	}

	.b-ma__su-subheading {
		font-size: 0.8em;
		opacity: 0.5;
		padding-top: 0.3em;
	}

	// main -> buttons

	.b-ma__buttons {
		padding-top: 0.8em;
		@include parent-row-right(0.4em);
	}

	// main -> button
	
	.b-ma__button.card {
		padding: 0.4em 0.8em 0.35em;
		@include clickable;
		@include hover-forward(1.04);
		--bg-deg: to right;

		> div {
			font-size: 1em;
		}

		&.white-dim-- {
			--bd: #{$yellow};
			--bd-a: 0.15;
		}
	}

	// main -> top

	.b-ma__top {
		// none
	}

	.b-ma__to-options {
		padding-right: 0.6em;
		@include parent-row-right(0.5em);
	}

	.b-ma__to-option {
		@include clickable;
		@include hover-forward(1.04);
		@include swish;
		opacity: 0.3;

		> img {
			height: 1.2em;
			margin-right: 0.25em;
		}

		> div {
			font-size: 1.2em;
		}

		&.b-selected-- {
			opacity: 1;
		}

		&:hover {
			opacity: 0.7;
		}
	}

	.b-ma__to-count {
		font-size: 1em;
		opacity: 0.3;
	}

	// main -> input

	.b-ma__input {
		font-size: 1.2em;
		@include custom-text;
		@include input;
		padding-top: 0.5em;
		@include no-scrollbar;
	}

	// main -> submit

	.b-ma__submit.card {
		position: absolute;
		top: unset;
		bottom: unset;
		left: unset;
		right: unset;
		@include clickable;
		@include hover-forward(1.04);
		--bd: #{$yellow};
		--bd-a: 0.15;
		--bg-deg: to right;
		padding: 0.5em 1.3em 0.45em;

		> div {
			font-size: 1.5em;

			> img {
				height: 1em;
				margin: -0.2em 0;
			}
		}

		&:not(.disabled) {
			@include pulse($yellow-hex);
		}

		&:hover {
			--bd-a: 0.3;
		}
	}

	// toggle

	.b-toggle.card {
		@include clickable;
		--bd: #{$yellow};
		--bd-a: 0.15;
		--bg-deg: to top;
		padding: 0.3em 0.4em;
		padding-left: 0em;
		overflow: hidden;

		&.b-toggled-- {
			--bd-a: 0.35;
		}

		&:hover {
			--bd-a: 0.5;
		}
	}

	// toggle -> face

	.b-to__face {
		height: 2em;
		padding-right: 0.2em;
		margin-left: -0.5em;
	}

	// toggle -> idea

	.b-to__idea {
		height: 2em;
	}
</style>