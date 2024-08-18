<script>// imports
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
};
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
    }
    catch (e) {
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
        }
        else if (data) {
            console.error(`Error when loading Buggy.so component: ${data}`);
        }
        else {
            console.error(`Unknown error when loading Buggy.so component.`);
        }
        jobs = jobs.filter(j => j !== `get_data`);
    }
    catch (e) {
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
    }
    catch (e) {
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
 
<style>@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@600&family=Gochi+Hand:wght@400&family=Fira+Code:wght@600&family=Rubik:wght@500&display=swap");
:global(html) {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}
:global(body),
:global(#svelte) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
  background-color: #000000;
  color: #FFF1C5;
}

:global(a) {
  color: inherit;
  text-decoration: none;
}

:global(*) {
  outline: none;
  margin: 0;
  font-family: "DM Sans";
  font-weight: 600;
  line-height: 1;
  scroll-behavior: smooth;
  letter-spacing: -0.04em;
  -webkit-tap-highlight-color: transparent;
}

/* width */
:global(::-webkit-scrollbar) {
  width: 0em;
}

/* Track */
:global(::-webkit-scrollbar-track) {
  background: rgba(255, 241, 197, 0);
}

/* Handle */
:global(::-webkit-scrollbar-thumb) {
  background: rgba(255, 241, 197, 0.1);
  border-radius: 0.5em;
}

/* Handle on hover */
:global(::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 241, 197, 0.2);
}

/* --- Visibility --- */
.visibility, .visibility.v-inline-- {
  display: none !important;
}
.visibility.sm-down--, .visibility.md-down--, .visibility.lg-down--, .visibility.xl-down-- {
  display: flex !important;
}
.visibility.sm-down--.v-inline--, .visibility.md-down--.v-inline--, .visibility.lg-down--.v-inline--, .visibility.xl-down--.v-inline-- {
  display: inline !important;
}

@media (min-width: 640px) {
  .visibility.sm-down--, .visibility.sm-down--.v-inline-- {
    display: none !important;
  }
  .visibility.sm-up--, .visibility.md-down--, .visibility.lg-down--, .visibility.xl-down-- {
    display: flex !important;
  }
  .visibility.sm-up--.v-inline--, .visibility.md-down--.v-inline--, .visibility.lg-down--.v-inline--, .visibility.xl-down--.v-inline-- {
    display: inline !important;
  }
}
@media (min-width: 800px) {
  .visibility.md-down--, .visibility.md-down--.v-inline-- {
    display: none !important;
  }
  .visibility.md-up--, .visibility.lg-down--, .visibility.xl-down-- {
    display: flex !important;
  }
  .visibility.md-up--.v-inline--, .visibility.lg-down--.v-inline--, .visibility.xl-down--.v-inline-- {
    display: inline !important;
  }
}
@media (min-width: 1024px) {
  .visibility.lg-down--, .visibility.lg-down--.v-inline-- {
    display: none !important;
  }
  .visibility.lg-up--, .visibility.xl-down-- {
    display: flex !important;
  }
  .visibility.lg-up--.v-inline--, .visibility.xl-down--.v-inline-- {
    display: inline !important;
  }
}
@media (min-width: 1280px) {
  .visibility.xl-down--, .visibility.xl-down--.v-inline-- {
    display: none !important;
  }
  .visibility.xl-up-- {
    display: flex !important;
  }
  .visibility.xl-up--.v-inline-- {
    display: inline !important;
  }
}
/* --- Container --- */
.container {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  background-position: center;
  background-repeat: no-repeat;
  --scr-w: 0.24em;
  --scr-tr-a: 0.2;
  --scr-clr: 255, 241, 197;
  --scr-th-a: 1;
  /* width */
  /* Track */
  /* Handle */
  /* Handle on hover */
}
.container.row-centre-- {
  justify-content: center;
  text-align: center;
}
.container.row-wrap-- {
  flex-wrap: wrap;
}
.container.row-top-- {
  align-items: flex-start;
}
.container.row-right-- {
  justify-content: flex-end;
  text-align: right;
}
.container.row-bottom-- {
  align-items: flex-end;
}
.container.bg-left-- {
  background-position: left;
}
.container::-webkit-scrollbar {
  width: var(--scr-w);
}
.container::-webkit-scrollbar-track {
  background: rgba(var(--scr-clr), var(--scr-tr-a));
}
.container::-webkit-scrollbar-thumb {
  background: rgba(var(--scr-clr), var(--scr-th-a));
  border-radius: 0.5em;
}
.container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.8);
}
.container.background-- {
  width: calc(100% - 20px);
  margin-top: calc(var(--parent-mg) * 2);
  margin-left: calc(var(--parent-mg) * 2);
}
.container.background-- > div {
  margin-top: calc(var(--parent-mg) * 2);
  margin-left: calc(var(--parent-mg) * 2);
  padding-bottom: calc(var(--parent-mg) * 2);
  padding-right: calc(var(--parent-mg) * 2);
}
.container.offset-- {
  margin-left: calc(var(--parent-mg) * 2 * 2) !important;
}
@media (min-width: 640px) {
  .container.offset-- {
    margin-left: calc(var(--parent-mg) * 2 * 2) !important;
  }
}
.container.stretch-- {
  align-self: stretch;
}
.container.grow-- {
  flex-grow: 1;
}
.container.row-sm--, .container.row-md--, .container.row-lg--, .container.row-xl--, .container.col-- {
  flex-direction: column;
  align-items: flex-start;
}
.container.row-sm--.col-top--, .container.row-md--.col-top--, .container.row-lg--.col-top--, .container.row-xl--.col-top--, .container.col--.col-top-- {
  justify-content: flex-start;
}
.container.row-sm--.col-centre--, .container.row-md--.col-centre--, .container.row-lg--.col-centre--, .container.row-xl--.col-centre--, .container.col--.col-centre-- {
  align-items: center;
  text-align: center;
}
.container.row-sm--.col-right--, .container.row-md--.col-right--, .container.row-lg--.col-right--, .container.row-xl--.col-right--, .container.col--.col-right-- {
  align-items: flex-end;
  text-align: right;
}
.container.row-sm--.col-middle--, .container.row-md--.col-middle--, .container.row-lg--.col-middle--, .container.row-xl--.col-middle--, .container.col--.col-middle-- {
  justify-content: center;
}
.container.row-sm--.col-bottom--, .container.row-md--.col-bottom--, .container.row-lg--.col-bottom--, .container.row-xl--.col-bottom--, .container.col--.col-bottom-- {
  justify-content: flex-end;
}
.container.row-sm--.col-wrap--, .container.row-md--.col-wrap--, .container.row-lg--.col-wrap--, .container.row-xl--.col-wrap--, .container.col--.col-wrap-- {
  flex-wrap: wrap;
}
.container.no-overflow-- {
  overflow: hidden;
}

@media (min-width: 640px) {
  .container.row-sm-- {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
  .container.row-sm--.row-centre-- {
    justify-content: center;
    text-align: center;
  }
  .container.row-sm--.row-wrap-- {
    flex-wrap: wrap;
  }
  .container.row-sm--.row-top-- {
    align-items: flex-start;
  }
  .container.row-sm--.row-right-- {
    justify-content: flex-end;
    text-align: right;
  }
  .container.row-sm--.row-bottom-- {
    align-items: flex-end;
  }
  .container.col-sm-- {
    flex-direction: column;
    align-items: flex-start;
  }
  .container.col-sm--.col-top-- {
    justify-content: flex-start;
  }
  .container.col-sm--.col-centre-- {
    align-items: center;
    text-align: center;
  }
  .container.col-sm--.col-right-- {
    align-items: flex-end;
    text-align: right;
  }
  .container.col-sm--.col-middle-- {
    justify-content: center;
  }
  .container.col-sm--.col-bottom-- {
    justify-content: flex-end;
  }
  .container.col-sm--.col-wrap-- {
    flex-wrap: wrap;
  }
}
@media (min-width: 800px) {
  .container.row-md-- {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
  .container.row-md--.row-centre-- {
    justify-content: center;
    text-align: center;
  }
  .container.row-md--.row-wrap-- {
    flex-wrap: wrap;
  }
  .container.row-md--.row-top-- {
    align-items: flex-start;
  }
  .container.row-md--.row-right-- {
    justify-content: flex-end;
    text-align: right;
  }
  .container.row-md--.row-bottom-- {
    align-items: flex-end;
  }
  .container.col-md-- {
    flex-direction: column;
    align-items: flex-start;
  }
  .container.col-md--.col-top-- {
    justify-content: flex-start;
  }
  .container.col-md--.col-centre-- {
    align-items: center;
    text-align: center;
  }
  .container.col-md--.col-right-- {
    align-items: flex-end;
    text-align: right;
  }
  .container.col-md--.col-middle-- {
    justify-content: center;
  }
  .container.col-md--.col-bottom-- {
    justify-content: flex-end;
  }
  .container.col-md--.col-wrap-- {
    flex-wrap: wrap;
  }
}
@media (min-width: 1024px) {
  .container.row-lg-- {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
  .container.row-lg--.row-centre-- {
    justify-content: center;
    text-align: center;
  }
  .container.row-lg--.row-wrap-- {
    flex-wrap: wrap;
  }
  .container.row-lg--.row-top-- {
    align-items: flex-start;
  }
  .container.row-lg--.row-right-- {
    justify-content: flex-end;
    text-align: right;
  }
  .container.row-lg--.row-bottom-- {
    align-items: flex-end;
  }
  .container.col-lg-- {
    flex-direction: column;
    align-items: flex-start;
  }
  .container.col-lg--.col-top-- {
    justify-content: flex-start;
  }
  .container.col-lg--.col-centre-- {
    align-items: center;
    text-align: center;
  }
  .container.col-lg--.col-right-- {
    align-items: flex-end;
    text-align: right;
  }
  .container.col-lg--.col-middle-- {
    justify-content: center;
  }
  .container.col-lg--.col-bottom-- {
    justify-content: flex-end;
  }
  .container.col-lg--.col-wrap-- {
    flex-wrap: wrap;
  }
}
@media (min-width: 1280px) {
  .container.row-xl-- {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
  .container.row-xl--.row-centre-- {
    justify-content: center;
    text-align: center;
  }
  .container.row-xl--.row-wrap-- {
    flex-wrap: wrap;
  }
  .container.row-xl--.row-top-- {
    align-items: flex-start;
  }
  .container.row-xl--.row-right-- {
    justify-content: flex-end;
    text-align: right;
  }
  .container.row-xl--.row-bottom-- {
    align-items: flex-end;
  }
  .container.col-xl-- {
    flex-direction: column;
    align-items: flex-start;
  }
  .container.col-xl--.col-top-- {
    justify-content: flex-start;
  }
  .container.col-xl--.col-centre-- {
    align-items: center;
    text-align: center;
  }
  .container.col-xl--.col-right-- {
    align-items: flex-end;
    text-align: right;
  }
  .container.col-xl--.col-middle-- {
    justify-content: center;
  }
  .container.col-xl--.col-bottom-- {
    justify-content: flex-end;
  }
  .container.col-xl--.col-wrap-- {
    flex-wrap: wrap;
  }
}
.text {
  --text-colour: 255, 241, 197;
  color: rgb(var(--text-colour));
}
.text.text-black-- {
  --text-colour: 0, 0, 0;
}
.text.text-blue-- {
  --text-colour: 104, 159, 254;
}
.text.text-green-- {
  --text-colour: 152, 214, 43;
}
.text.text-orange-- {
  --text-colour: 255, 123, 71;
}
.text.text-red-- {
  --text-colour: 255, 72, 72;
}
.text.text-white-- {
  --text-colour: 255, 241, 197;
}
.text.text-yellow-- {
  --text-colour: 255, 154, 52;
}
.text.text-yellow-dim-- {
  --text-colour: 99, 50, 11;
}

.svg {
  --filter-colour: brightness(0) saturate(100%) invert(98%) sepia(6%) saturate(1845%) hue-rotate(328deg) brightness(101%) contrast(99%);
  filter: var(--filter-colour);
}
.svg.svg-black-- {
  --filter-colour: invert(0%) sepia(82%) saturate(7429%) hue-rotate(43deg) brightness(112%) contrast(114%);
}
.svg.svg-blue-- {
  --filter-colour: brightness(0) saturate(100%) invert(53%) sepia(81%) saturate(525%) hue-rotate(188deg) brightness(100%) contrast(99%);
}
.svg.svg-green-- {
  --filter-colour: brightness(0) saturate(100%) invert(63%) sepia(95%) saturate(330%) hue-rotate(38deg) brightness(98%) contrast(100%);
}
.svg.svg-orange-- {
  --filter-colour: brightness(0) saturate(100%) invert(56%) sepia(85%) saturate(1214%) hue-rotate(329deg) brightness(101%) contrast(100%);
}
.svg.svg-red-- {
  --filter-colour: brightness(0) saturate(100%) invert(37%) sepia(91%) saturate(2118%) hue-rotate(334deg) brightness(101%) contrast(101%);
}
.svg.svg-white-- {
  --filter-colour: brightness(0) saturate(100%) invert(98%) sepia(6%) saturate(1845%) hue-rotate(328deg) brightness(101%) contrast(99%);
}
.svg.svg-yellow-- {
  --filter-colour: brightness(0) saturate(100%) invert(63%) sepia(88%) saturate(606%) hue-rotate(333deg) brightness(101%) contrast(100%);
}
.svg.svg-yellow-dim-- {
  --filter-colour: brightness(0) saturate(100%) invert(18%) sepia(74%) saturate(973%) hue-rotate(357deg) brightness(94%) contrast(93%);
}

.disabled {
  filter: brightness(0.35) !important;
  pointer-events: none !important;
}

.image {
  border-radius: 2px;
}

.card {
  --bg-1: 255, 241, 197;
  --bg-2: 255, 241, 197;
  --bg-a1: 1;
  --bg-a2: 1;
  --bg-deg: to bottom;
  --bd: 255, 241, 197;
  --bd-a: 0.05;
  --bd-w: 0.17em;
  --bd-r: 1.3em;
  transition-duration: 0.2s;
  top: 0;
  position: relative;
  background: linear-gradient(var(--bg-deg), rgba(var(--bg-1), var(--bg-a1)), rgba(var(--bg-2), var(--bg-a2)));
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: 120% 120%;
  border: var(--bd-w) solid rgba(var(--bd), var(--bd-a));
  border-radius: var(--bd-r);
}
.card.moveup--:hover {
  z-index: 2;
}
.card.fill-- {
  --bg-a1: 1;
  --bg-a2: 1;
}
.card.black-- {
  --bg-1: 0, 0, 0;
  --bg-2: 0, 0, 0;
  --bd: 0, 0, 0;
}
.card.blue-- {
  --bg-1: 104, 159, 254;
  --bg-2: 104, 159, 254;
  --bd: 104, 159, 254;
}
.card.green-- {
  --bg-1: 152, 214, 43;
  --bg-2: 152, 214, 43;
  --bd: 152, 214, 43;
}
.card.green-dim-- {
  --bg-1: 0, 0, 0;
  --bg-2: 24, 41, 4;
  --bd: 255, 241, 197;
}
.card.green-dark-- {
  --bg-1: 0, 0, 0;
  --bg-2: 7, 12, 1;
  --bd: 255, 241, 197;
}
.card.orange-- {
  --bg-1: 255, 123, 71;
  --bg-2: 255, 123, 71;
  --bd: 255, 123, 71;
}
.card.orange-dim-- {
  --bg-1: 0, 0, 0;
  --bg-2: 113, 32, 0;
  --bd: 255, 241, 197;
}
.card.orange-dark-- {
  --bg-1: 0, 0, 0;
  --bg-2: 39, 16, 6;
  --bd: 255, 241, 197;
}
.card.red-- {
  --bg-1: 255, 72, 72;
  --bg-2: 255, 72, 72;
  --bd: 255, 72, 72;
}
.card.red-dim-- {
  --bg-1: 0, 0, 0;
  --bg-2: 67, 23, 18;
  --bd: 255, 241, 197;
}
.card.red-dark-- {
  --bg-1: 0, 0, 0;
  --bg-2: 29, 5, 2;
  --bd: 255, 241, 197;
}
.card.white-- {
  --bg-1: 255, 241, 197;
  --bg-2: 255, 241, 197;
  --bd: 255, 241, 197;
}
.card.white-dim-- {
  --bg-1: 255, 241, 197;
  --bg-2: 255, 236, 216;
  --bd: 255, 241, 197;
}
.card.yellow-- {
  --bg-1: 255, 154, 52;
  --bg-2: 255, 154, 52;
  --bd: 255, 154, 52;
}
.card.yellow-dim-- {
  --bg-1: 0, 0, 0;
  --bg-2: 99, 50, 11;
  --bd: 255, 241, 197;
}
.card.yellow-dark-- {
  --bg-1: 0, 0, 0;
  --bg-2: 48, 27, 5;
  --bd: 255, 241, 197;
}

.window {
  transition-duration: 0.2s;
  position: fixed;
  overflow: auto;
  top: 0;
  left: 0;
  width: calc(100% - 4em);
  height: calc(100% - 4em);
  padding: 2em;
  background-color: rgba(0, 0, 0, 0.93);
  z-index: 10;
}
.window:not(.toggled--) {
  display: none;
}
.window:not(.visible--) {
  opacity: 0;
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  background-size: cover;
  background-position: center;
  opacity: 1;
}

.bgbox {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
}

.buggy {
  transition-duration: 0.2s;
  position: fixed;
  font-size: 12px;
}
.buggy:not(.no-hover--):hover {
  transform: scale(1.02);
}
@media (min-width: 640px) {
  .buggy {
    font-size: 15px;
  }
}
.buggy.b-toggled-- .b-main.card {
  width: 18em;
}
.buggy.b-top-left-- {
  top: 2em;
  left: 2em;
  bottom: unset;
  right: unset;
}
.buggy.b-top-left-- > .b-main.card {
  top: 3.5em;
  left: 0;
}
.buggy.b-top-left-- > .b-main.card > .b-ma__submit.card {
  bottom: calc(100% + 0.7em);
  right: 0;
}
.buggy.b-top-right-- {
  top: 2em;
  left: unset;
  bottom: unset;
  right: 2em;
}
.buggy.b-top-right-- > .b-main.card {
  top: 3.5em;
  right: 0;
}
.buggy.b-top-right-- > .b-main.card > .b-ma__submit.card {
  bottom: calc(100% + 0.7em);
  left: 0;
}
.buggy.b-bottom-left-- {
  top: unset;
  left: 2em;
  bottom: 2em;
  right: unset;
}
.buggy.b-bottom-left-- > .b-main.card {
  bottom: 3.5em;
  left: 0;
}
.buggy.b-bottom-left-- > .b-main.card > .b-ma__submit.card {
  top: calc(100% + 0.7em);
  right: 0;
}
.buggy.b-bottom-right-- {
  top: unset;
  left: unset;
  bottom: 2em;
  right: 2em;
}
.buggy.b-bottom-right-- > .b-main.card {
  bottom: 3.5em;
  right: 0;
}
.buggy.b-bottom-right-- > .b-main.card > .b-ma__submit.card {
  top: calc(100% + 0.7em);
  left: 0;
}

.b-main.card {
  position: absolute;
  max-width: 18em;
  padding: 1em;
  height: 8em;
  top: unset;
  bottom: unset;
  left: unset;
  right: unset;
  --bd: 255, 154, 52;
  --bd-a: 0.15;
  --bg-deg: to bottom;
  animation: pulse-animation 2s infinite;
}
@keyframes pulse-animation {
  0% {
    box-shadow: 0em 0em 0em 0em rgba(255, 154, 52, 0.4);
  }
  100% {
    box-shadow: 0em 0em 20em 2em rgba(255, 154, 52, 0);
  }
}
.b-main.card.b-submitted-- {
  height: 5em;
}
.b-main.card:hover {
  --bd-a: 0.3;
}

.b-ma__su-heading > div {
  font-size: 1.15em;
  padding-right: 0.2em;
}
.b-ma__su-heading > img {
  height: 1.25em;
}

.b-ma__su-subheading {
  font-size: 0.8em;
  opacity: 0.5;
  padding-top: 0.3em;
}

.b-ma__buttons {
  padding-top: 0.8em;
}
.b-ma__buttons > a:not(:last-child),
.b-ma__buttons > div:not(:last-child),
.b-ma__buttons > img:not(:last-child),
.b-ma__buttons > span:not(:last-child),
.b-ma__buttons > input:not(:last-child),
.b-ma__buttons > :global(a):not(:last-child),
.b-ma__buttons > :global(div):not(:last-child),
.b-ma__buttons > :global(img):not(:last-child) {
  margin-right: 0.4em;
}

.b-ma__button.card {
  padding: 0.4em 0.8em 0.35em;
  cursor: pointer;
  --bg-deg: to right;
}
.b-ma__button.card:not(.no-hover--):hover {
  transform: scale(1.04);
}
.b-ma__button.card > div {
  font-size: 1em;
}
.b-ma__button.card.white-dim-- {
  --bd: 255, 154, 52;
  --bd-a: 0.15;
}

.b-ma__to-options {
  padding-right: 0.6em;
}
.b-ma__to-options > a:not(:last-child),
.b-ma__to-options > div:not(:last-child),
.b-ma__to-options > img:not(:last-child),
.b-ma__to-options > span:not(:last-child),
.b-ma__to-options > input:not(:last-child),
.b-ma__to-options > :global(a):not(:last-child),
.b-ma__to-options > :global(div):not(:last-child),
.b-ma__to-options > :global(img):not(:last-child) {
  margin-right: 0.5em;
}

.b-ma__to-option {
  cursor: pointer;
  transition-duration: 0.2s;
  opacity: 0.3;
}
.b-ma__to-option:not(.no-hover--):hover {
  transform: scale(1.04);
}
.b-ma__to-option > img {
  height: 1.2em;
  margin-right: 0.25em;
}
.b-ma__to-option > div {
  font-size: 1.2em;
}
.b-ma__to-option.b-selected-- {
  opacity: 1;
}
.b-ma__to-option:hover {
  opacity: 0.7;
}

.b-ma__to-count {
  font-size: 1em;
  opacity: 0.3;
}

.b-ma__input {
  font-size: 1.2em;
  font-family: "Gochi Hand";
  letter-spacing: 0.05em;
  line-height: 1em;
  font-weight: 400;
  background: none;
  border: none;
  resize: none;
  transition-duration: 0.2s;
  padding: 0.2em;
  width: 100%;
  -moz-appearance: textfield;
  padding-top: 0.5em;
}
.b-ma__input::-webkit-outer-spin-button, .b-ma__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.b-ma__input::placeholder {
  color: rgba(255, 241, 197, 0.3);
}
.b-ma__input::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.b-ma__submit.card {
  position: absolute;
  top: unset;
  bottom: unset;
  left: unset;
  right: unset;
  cursor: pointer;
  --bd: 255, 154, 52;
  --bd-a: 0.15;
  --bg-deg: to right;
  padding: 0.5em 1.3em 0.45em;
}
.b-ma__submit.card:not(.no-hover--):hover {
  transform: scale(1.04);
}
.b-ma__submit.card > div {
  font-size: 1.5em;
}
.b-ma__submit.card:not(.disabled) {
  animation: pulse-animation 2s infinite;
}
@keyframes pulse-animation {
  0% {
    box-shadow: 0em 0em 0em 0em rgba(255, 154, 52, 0.4);
  }
  100% {
    box-shadow: 0em 0em 20em 2em rgba(255, 154, 52, 0);
  }
}
.b-ma__submit.card:hover {
  --bd-a: 0.3;
}

.b-toggle.card {
  cursor: pointer;
  --bd: 255, 154, 52;
  --bd-a: 0.15;
  --bg-deg: to top;
  padding: 0.3em 0.4em;
  padding-left: 0em;
  overflow: hidden;
}
.b-toggle.card.b-toggled-- {
  --bd-a: 0.35;
}
.b-toggle.card:hover {
  --bd-a: 0.5;
}

.b-to__face {
  height: 2em;
  padding-right: 0.2em;
  margin-left: -0.5em;
}

.b-to__idea {
  height: 2em;
}</style>