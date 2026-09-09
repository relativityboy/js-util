import {getStatePath} from "./get_state_path";

/**
 * Returns a getter for the passed in state tree for simpler retrieval node values.
 * Can provide subtree getter at .subtree(path) on the initial returned getter.
 * WARNING - Use intelligently. State is not cloned.
 * @param state
 * @returns {function(*, *=): string}
 */
export const staticStateGetter = (state) => {
    const getter = (path, defaultVal=undefined) => {
        return getStatePath(state, path, defaultVal)
    }

    getter.subtree = (path) => {
        if(!path) {
            throw Error(`Cannot create subtree. Empty path '${path}' is not permitted`)
        }
        const subState = getStatePath(state, path)
        if(typeof subState === 'undefined') {
            throw Error(`Cannot create subtree. Path '${path}' is undefined`)
        }
        return staticStateGetter(subState)
    }

    getter.liveSubtree = (path) => {
        if(!path) {
            throw Error(`Cannot create liveSubtree. Empty path '${path}' is not permitted`)
        }
        return (subPath, defaultVal=undefined) => {
            return getStatePath(state, `${path}.${subPath}`, defaultVal)
        }
    }
    return getter
}