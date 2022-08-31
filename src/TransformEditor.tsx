/**
 * @license
 * Copyright (c) 2022. EasyMetaHub, LLC - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 */


import React, {useCallback, useRef, useState} from 'react';
import {
    Editor,
    Schema,
    Kinds,
    GetSchema,
    EditorAction,
    EditorState,
    reduce,
} from "react-dataflow-editor";

const kinds = {
    src1: {
        name: "Source 1",
        inputs: { },
        outputs: { v: null },
        backgroundColor: "goldenrod",
    },
    src2: {
        name: "Source 2",
        inputs: { },
        outputs: { v: null },
        backgroundColor: "goldenrod",
    },
    target: {
        name: "Target",
        inputs: { v: null },
        outputs: {  },
        backgroundColor: "goldenrod",
    },
    add: {
        name: "Addition",
        inputs: { a: null, b: null },
        outputs: { sum: null },
        backgroundColor: "lavender",
    },
    sub: {
        name: "Subtraction",
        inputs: { a: null, b: null },
        outputs: { difference: null },
        backgroundColor: "lavender",
    },
    div: {
        name: "Division",
        inputs: { dividend: null, divisor: null },
        outputs: { quotient: null, remainder: null },
        backgroundColor: "darksalmon",
    },
};

function Index<S extends Schema>({
                                     kinds,
                                     initialState,
                                 }: {
    kinds: Kinds<S>
    initialState: EditorState<S>
}) {
    const [state, setState] = useState(initialState)

    const stateRef = useRef<EditorState<S>>(state)
    stateRef.current = state

    const dispatch = useCallback((action: EditorAction<S>) => {
        console.log("dispatch", action)
        setState(reduce(kinds, stateRef.current, action))
    }, [kinds])

    return <Editor<S> kinds={kinds} state={state} dispatch={dispatch} />
}

type S = GetSchema<typeof kinds>;


export default function TransformEditor() {
    return (
        <div className="BasePage">
            <Index<S>
                kinds={kinds}
                initialState={{
                    focus: null,
                    nodes: {
                        a: {
                            id: "a",
                            kind: "add",
                            position: { x: 4, y: 1 },
                            inputs: { a: null, b: null },
                            outputs: { sum: ["c"] },
                        },
                        b: {
                            id: "b",
                            kind: "div",
                            position: { x: 9, y: 3 },
                            inputs: { dividend: "c", divisor: null },
                            outputs: { quotient: [], remainder: [] },
                        },
                    },
                    edges: {
                        c: {
                            id: "c",
                            source: { id: "a", output: "sum" },
                            target: { id: "b", input: "dividend" },
                        },
                    },
                }}
            />
        </div>
    );
}
