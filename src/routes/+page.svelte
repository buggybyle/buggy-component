<script lang="ts">
	const COMPONENT_API_KEY = import.meta.env.VITE_COMPONENT_API_KEY;
	import Buggy from '../lib/pkg/Buggy.svelte';
</script>

<Buggy
	api_key={COMPONENT_API_KEY}
/>

<style lang="scss">
	@import '../lib/assets/scss/all.scss';
</style>
