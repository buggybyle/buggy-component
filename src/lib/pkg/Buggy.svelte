<script lang="ts">
  // imports

	import { onDestroy, onMount } from 'svelte';
  import * as api from '../assets/js/api';
  import * as utils from '../assets/js/utils';
  import bug_icon_image from '../assets/images/icons/bug.svg';
  import face_icon_image from '../assets/images/icons/face.svg';
  import idea_icon_image from '../assets/images/icons/idea.svg';
	import upload_icon_image from '../assets/images/icons/upload.svg';
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
		body: ``,
		attachments: [],
		custom_labels: []
	}
	let view = `main`; // <`main`, `submitted`>
	let new_submission;
	let main_attachment_uploader;
	let main_labels_options_div;

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
			submission_input.attachments = [];
			submission_input.custom_labels = [];
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
		class="container  col--  buggy  b-{y_position}-{x_position}--"
		class:b-toggled--={is_toggled}
		class:col-left--={x_position === `left`}
		class:col-right--={x_position === `right`}
		style="
			top: {
				(y_position === `top`) ?
					`calc(2em + ${y_offset_px || 0}px)` :
					`unset`
			};
			bottom: {
				(y_position === `bottom`) ?
					`calc(2em + ${y_offset_px || 0}px)` :
					`unset`
			};
			left: {
				(x_position === `left`) ?
					`calc(2em + ${x_offset_px || 0}px)` :
					`unset`
			};
			right: {
				(x_position === `right`) ?
					`calc(2em + ${x_offset_px || 0}px)` :
					`unset`
			};
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
				<!-- main -> powered -->
				<a
					href="https://buggy.so"
					target="_blank"
					rel="noreferrer"
					class="container  row--  row-centre--  text  card  b-ma__powered"
					class:text-yellow--={theme === `dark`}
					class:yellow-dark--={theme === `dark`}
					class:text-yellow-dim--={theme === `light`}
					class:white-dim--={theme === `light`}
				>
					<div>
						<span>Powered by</span>
						Buggy.so
						<span>by Lefrost</span>
					</div>
				</a>

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

						<!-- main -> top -> upload (input) -->
						<input
							type="file"
							accept="image/*"
							bind:this={main_attachment_uploader}
							on:change={async () => {
								try {
									if (!jobs.includes(`process_image_attachment`) && main_attachment_uploader.value) {
										jobs.push(`process_image_attachment`);
										jobs = jobs;
										
										if (submission_input.attachments.length < 5) {
											// note: upload of file doesn't actually happen until data is sent to backend

											let file = main_attachment_uploader.files[0];

											if (file && (file.size < (2 * 1000 * 1000))) {
												// note: get `settings_input.new_icon_image_base64` from file
												let image_base64 = await utils.blobToDataUrl(file, `file`) || ``;
												
												if (image_base64) {
													submission_input.attachments.push({
														type: `image`,
														data: {
															image_base64
														}
													});
													submission_input.attachments = submission_input.attachments;
												}
											}
										}

										main_attachment_uploader.value = null;

										jobs = jobs.filter(j => j !== `process_image_attachment`);
									}
								} catch (e) {
									console.log(e);
								}
							}}
							id="main_attachment_uploader"
							style="display: none;"
						/>

						<!-- main -> top -> upload (label) -->
						<label
							class="container  row--  row-centre--  card  b-ma__to-upload"
							class:yellow-dark--={theme === `dark`}
							class:white-dim--={theme === `light`}
							class:disabled={submission_input.attachments.length >= 5}
							for="main_attachment_uploader"
						>
							<img
								src={upload_icon_image}
								alt=""
								class="svg"
								class:svg-yellow--={theme === `dark`}
								class:svg-yellow-dim--={theme === `light`}
							/>
							
							<span>
								Images,<br />
								2MB max
							</span>
						</label>

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
						class="container  grow--  stretch--  col--  text  b-ma__input  b-font-{(project.component_config || {}).submission_font}--"
						class:text-white--={theme === `dark`}
						class:text-yellow-dim--={theme === `light`}
						maxlength={submission_max_length || DEFAULT_SUBMISSION_BODY_MAX_LENGTH}
					/>

					{#if (submission_input.attachments.filter(a => a.type === `image`).length >= 1)}
						<!-- main -> attachments -->
						<div class="container  stretch--  col--  b-ma__attachments">
							<!-- main -> attachments -> text -->
							<div class="b-ma__at-text">
								<span>
									{submission_input.attachments.filter(a => a.type === `image`).length || 0}
									images uploaded
								</span>
								<span>5 maximum</span>
							</div>

							<!-- main -> attachments -> items -->
							<div class="container  stretch--  row--  row-left--  row-wrap--  b-ma__at-items">
								{#each submission_input.attachments.filter(a => a.type === `image`) as image_attachment, ai}
									<!-- item -->
									<div
										class="container  row--  row-centre--  text  text-white--  card  black--  b-ma__at-item"
										on:click={() => {
											try {
												let attachment_index = submission_input.attachments.findIndex(a =>
													(a.type === `image`) &&
													((a.data || {}).image_base64 === (image_attachment.data || {}).image_base64)
												);

												if (attachment_index >= 0) {
													submission_input.attachments.splice(attachment_index, 1);
													submission_input.attachments = submission_input.attachments;
												}
											} catch (e) {
												console.log(e);
											}
										}}
									>
										<!-- item -> image -->
										<img	
											src={(image_attachment.data || {}).image_base64 || ``}
											alt=""
											class="b-ma__at-it-image"
										/>

										<!-- item -> overlay -->
										<div class="container  row--  row-centre--  text  text-white--  card  black--  b-ma__at-it-overlay">
											<div>X</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					{#if (project.custom_labels || []).length >= 1}
						<!-- main -> labels -->
						<div class="container  stretch--  col--  b-ma__labels">
							<!-- main -> labels -> top -->
							<div class="container  stretch--  row--  row-left--  b-ma__la-top">
								<!-- main -> labels -> top -> text -->
								<div class="b-ma__la-to-text">
									Select labels
								</div>

								<!-- main -> labels -> top -> actions -->
								<div class="container  grow--  row--  row-right--  b-ma__la-to-actions">
									<!-- main -> labels -> top -> action (left) -->
									<div
										class="container  row--  row-centre--  b-ma__la-to-action"
										on:click={() => {
											try {
												main_labels_options_div.scrollLeft -= 100;

												if (main_labels_options_div.scrollLeft < 0) {
													main_labels_options_div.scrollLeft = 0;
												}
											} catch (e) {
												console.log(e);
											}
										}}
									>
										<div>←</div>
									</div>

									<!-- main -> labels -> top -> action (right) -->
									<div
										class="container  row--  row-centre-  b-ma__la-to-action"
										on:click={() => {
											try {
												main_labels_options_div.scrollLeft += 100;

												let max_scroll_left = main_labels_options_div.scrollWidth - main_labels_options_div.clientWidth;

												if (main_labels_options_div.scrollLeft > max_scroll_left) {
													main_labels_options_div.scrollLeft = max_scroll_left;
												}
											} catch (e) {
												console.log(e);
											}
										}}
									>
										<div>→</div>
									</div>
								</div>
							</div>

							<!-- main -> labels -> options -->
							<div
								bind:this={main_labels_options_div}
								class="container  stretch--  row--  row-left--  b-ma__la-options"
							>
								{#each (project.custom_labels || []) as custom_label}
									<!-- option -->
									<div
										class="container  row--  row-centre--  text  card  b-ma__la-option"
										class:text-white--={theme === `dark`}
										class:yellow-dark--={theme === `dark`}
										class:text-yellow-dim--={theme === `light`}
										class:white-dim--={theme === `light`}
										class:b-selected--={submission_input.custom_labels.includes(custom_label.text)}
										on:click={() => {
											try {
												if (submission_input.custom_labels.includes(custom_label.text)) {
													submission_input.custom_labels = submission_input.custom_labels.filter(code => code !== custom_label.text);
												} else {
													submission_input.custom_labels.push(utils.clone(custom_label).text || ``);
													submission_input.custom_labels = submission_input.custom_labels;
												}
											} catch (e) {
												console.log(e);
											}
										}}
									>
										<div class="container  row--  row-centre--  card  {custom_label.colour}--" />
										<div>
											{utils.shortenString({
												string: custom_label.text || ``,
												length: 20
											}) || `n/a`}
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/if}

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
												attachments: (submission_input.attachments || []).slice(0, 5) || [],
												custom_labels: (submission_input.custom_labels || []).filter(code =>
													((project || {}).custom_labels || []).some(pl =>
														pl.text === code
													)
												) || []
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
			// top: 2em;
			// left: 2em;
			// bottom: unset;
			// right: unset;

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
			// top: 2em;
			// left: unset;
			// bottom: unset;
			// right: 2em;

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
			// top: unset;
			// left: 2em;
			// bottom: 2em;
			// right: unset;

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
			// top: unset;
			// left: unset;
			// bottom: 2em;
			// right: 2em;

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
		padding: 0.7em 1em;
		height: fit-content;
		// height: calc(11em - 1em * 2);
		top: unset;
		bottom: unset;
		left: unset;
		right: unset;
		--bd: #{$yellow};
		--bd-a: 0.15;
		--bg-deg: to bottom;
		@include pulse($yellow-hex);

		&.b-submitted-- {
			// height: calc(7em - 1em * 2);
		}

		&:hover {
			--bd-a: 0.3;
		}
	}

	.b-ma__powered.card {
		position: absolute;
		top: unset;
		bottom: calc(100% + 0.6em);
		padding: 0.4em 0.8em 0.35em;
		--bg-deg: to right;
		left: 50%;
		transform: translateX(-50%);
		font-size: 1em;

		> div {
			white-space: nowrap;
			font-size: 0.8em;
			
			> span {
				opacity: 0.3;
			}
		}

		&:hover {
			font-size: 1.04em;
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

	.b-ma__to-upload.card {
		margin-right: 0.5em;
		padding: 0.3em;
		border-radius: 50%;
		--bd-a: 0.1;
		@include clickable;
		@include hover-forward(1.04);

		&:hover {
			> span {
				opacity: 0.6;
			}
		}

		> img {
			height: 1.1em;
		}

		> span {
			@include swish;
			position: absolute;
			left: unset;
			right: calc(100% + 0.8em);
			font-size: 0.7em;
			opacity: 0.3;
			white-space: nowrap;
			text-align: right;
			line-height: 1em;
		}
	}

	.b-ma__to-count {
		font-size: 0.8em;
		opacity: 0.3;
		min-width: 3.2em;
		text-align: right;
	}

	// main -> input

	.b-ma__input {
		font-size: 1.2em;
		@include custom-text;
		@include input;
		padding-top: 0.5em;
		@include no-scrollbar;
		height: 5em;

		&.b-font-handwriting-- {
			// none, default
		}

		&.b-font-basic-- {
			@include basic-text;
		}
	}

	// main -> attachments

	.b-ma__attachments {
		padding-top: 0.6em;
	}

	.b-ma__at-text {
		// none

		> span {
			font-size: 0.85em;

			&:nth-of-type(1) {
				opacity: 0.6;
			}

			&:nth-of-type(2) {
				opacity: 0.3;
			}
		}
	}

	.b-ma__at-items {
		padding-top: 0.3em;
		margin-right: -0.45em;
		margin-bottom: -0.4em;
	}

	.b-ma__at-item.card {
		margin-right: 0.45em;
		margin-bottom: 0.4em;
		@include clickable;
		@include hover-forward(1.04);
		--bg-a1: 0;
		--bg-a2: 0;
		--bd: #{$yellow};
		--bd-a: 0.2;
		overflow: hidden;

		&:hover {
			// none
			
			> .b-ma__at-it-overlay.card {
				opacity: 1;
			}
		}
	}

	.b-ma__at-it-image {
		height: 2em;
		max-width: 5em;
	}

	.b-ma__at-it-overlay.card {
		z-index: 1;
		--bg-a1: 0.3;
		--bg-a2: 0.3;
		--bd-w: 0em;
		opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
		
		> div {
			font-size: 1.5em;
		}
	}

	// main -> labels

	.b-ma__labels {
		padding-top: 0.6em;
	}

	.b-ma__la-top {
		// none
	}

	.b-ma__la-to-text {
		font-size: 0.85em;
		opacity: 0.5;;
		padding-right: 0.5em;
	}

	.b-ma__la-to-actions {
		// none
	}

	.b-ma__la-to-action {
		padding: 0.2em 0.4em;
		@include clickable;
		@include hover-forward(1.04);
		opacity: 0.35;
		@include swish;

		> div {
			font-size: 1em;
		}

		&:hover {
			opacity: 1;
		}
	}

	.b-ma__la-options {
		padding-top: 0.3em;
		@include no-scrollbar;
		@include parent-row-right(0.4em);
		overflow: auto;
		margin-right: -0.4em;
		margin-bottom: -0.35em;
	}

	.b-ma__la-option.card {
		--bg-deg: to right;
    margin-right: 0.4em;
    margin-bottom: 0.35em;
    @include clickable;
    @include hover-forward(1.04);
    padding: 0.35em 0.8em 0.3em;

    > div {
      @include swish;

      &:nth-of-type(1).card {
        height: 0.6em;
        @include dot-card;
        margin-right: 0.2em;
        opacity: 0.4;
      }

      &:nth-of-type(2) {
        font-size: 0.75em;
        opacity: 0.4;
      }
    }

    &.b-selected-- {
      --bd-a: 0.3;

      > div {
        &:nth-of-type(1) {
          opacity: 1;
        }

        &:nth-of-type(2) {
          opacity: 1;
        }
      }
    }
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