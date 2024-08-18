import { SvelteComponent } from "svelte";
declare const __propDef: {
    props: {
        api_key?: string;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
    exports?: {};
    bindings?: string;
};
export type BuggyProps = typeof __propDef.props;
export type BuggyEvents = typeof __propDef.events;
export type BuggySlots = typeof __propDef.slots;
export default class Buggy extends SvelteComponent<BuggyProps, BuggyEvents, BuggySlots> {
}
export {};
