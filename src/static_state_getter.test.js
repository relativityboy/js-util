import { staticStateGetter } from "./static_state_getter";

describe("staticStateGetter", () => {
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

    it("returns a function getter", () => {
        const getter = staticStateGetter(state);
        expect(typeof getter).toEqual("function");
    });

    it("getter returns passed-in state when called with no path / empty path", () => {
        const getter = staticStateGetter(state);

        const resp1 = getter();
        expect(resp1 === state).toBeTruthy();

        const resp2 = getter("");
        expect(resp2 === state).toBeTruthy();
    });

    it("getter returns values at paths (single node and dotted path)", () => {
        const getter = staticStateGetter(state);

        expect(getter("f")).toEqual("g");
        expect(getter("l.o.p")).toEqual("q");
    });

    it("getter returns undefined for missing paths when no default is provided", () => {
        const getter = staticStateGetter(state);

        const resp = getter("a.b.c");
        expect(typeof resp).toEqual("undefined");
    });

    it("getter returns defaultVal for missing paths when default is provided", () => {
        const getter = staticStateGetter(state);

        expect(getter("a.b.c", "fallback")).toEqual("fallback");
    });

    it("getter has a subtree(path) function that returns another getter", () => {
        const getter = staticStateGetter(state);
        expect(typeof getter.subtree).toEqual("function");

        const subGetter = getter.subtree("l.o");
        expect(typeof subGetter).toEqual("function");
        expect(typeof subGetter.subtree).toEqual("function");
    });

    it("subtree getter reads relative to the subtree root", () => {
        const getter = staticStateGetter(state);

        const subGetter = getter.subtree("l.o");
        expect(subGetter("p")).toEqual("q");

        // subtree getter should return the subtree itself when called with no path/empty path
        const subtreeState = subGetter();
        expect(subtreeState).toEqual({ p: "q" });

        const subtreeState2 = subGetter("");
        expect(subtreeState2).toEqual({ p: "q" });
    });

    it("subtree throws if the path is undefined", () => {
        const getter = staticStateGetter(state);

        expect(() => getter.subtree("a.b.c")).toThrow(
            "Cannot create subtree. Path 'a.b.c' is undefined"
        );
    });

    it("subtree does NOT throw if the path exists but the value is falsy (null/false/0/empty string)", () => {
        const falsyState = {
            a: null,
            b: false,
            c: 0,
            d: "",
            e: {
                inner: null,
            },
        };

        const getter = staticStateGetter(falsyState);

        expect(() => getter.subtree("a")).not.toThrow();
        expect(() => getter.subtree("b")).not.toThrow();
        expect(() => getter.subtree("c")).not.toThrow();
        expect(() => getter.subtree("d")).not.toThrow();

        const aGetter = getter.subtree("a");
        expect(aGetter()).toBeNull();

        const bGetter = getter.subtree("b");
        expect(bGetter()).toEqual(false);

        const cGetter = getter.subtree("c");
        expect(cGetter()).toEqual(0);

        const dGetter = getter.subtree("d");
        expect(dGetter()).toEqual("");
    });

    it("subtree getter is static: it reflects mutations to the underlying state object (no cloning)", () => {
        const getter = staticStateGetter(state);

        expect(getter("l.o.p")).toEqual("q");
        state.l.o.p = "changed";
        expect(getter("l.o.p")).toEqual("changed");

        const subGetter = getter.subtree("l.o");
        expect(subGetter("p")).toEqual("changed");
        state.l.o.p = "changed-again";
        expect(subGetter("p")).toEqual("changed-again");
    });
});
