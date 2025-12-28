// get_state_path.test.js
import { getStatePath } from "./get_state_path";

describe("getStatePath", () => {
    let state = null;

    beforeEach(() => {
        state = {
            f: "g",
            l: {
                m: "n",
                o: {
                    p: "q",
                },
            },
        };
    });

    it("returns passed in state if no path or empty path is provided", () => {
        const resp1 = getStatePath(state);
        expect(resp1 === state).toBeTruthy();

        const resp2 = getStatePath(state, "");
        expect(resp2 === state).toBeTruthy();
    });

    it("returns value at a single-level path", () => {
        const resp = getStatePath(state, "f");
        expect(resp).toEqual("g");
    });

    it("returns value at a dotted path", () => {
        const resp = getStatePath(state, "l.o.p");
        expect(resp).toEqual("q");
    });

    it("returns undefined if path does not exist and no defaultVal is provided", () => {
        const resp = getStatePath(state, "a.b.c");
        expect(typeof resp).toEqual("undefined");
    });

    it("returns defaultVal if path does not exist and defaultVal is provided", () => {
        const resp = getStatePath(state, "a.b.c", "fallback");
        expect(resp).toEqual("fallback");
    });

    it("returns defaultVal if part of the path resolves to undefined", () => {
        const resp = getStatePath(state, "l.x.y", 123);
        expect(resp).toEqual(123);
    });

    it("does NOT return defaultVal when the resolved value is falsy but defined", () => {
        const falsyState = {
            a: null,
            b: false,
            c: 0,
            d: "",
        };

        expect(getStatePath(falsyState, "a", "fallback")).toBeNull();
        expect(getStatePath(falsyState, "b", "fallback")).toEqual(false);
        expect(getStatePath(falsyState, "c", "fallback")).toEqual(0);
        expect(getStatePath(falsyState, "d", "fallback")).toEqual("");
    });

    it("returns undefined when defaultVal itself is explicitly undefined", () => {
        const resp = getStatePath(state, "a.b.c", undefined);
        expect(typeof resp).toEqual("undefined");
    });
});
