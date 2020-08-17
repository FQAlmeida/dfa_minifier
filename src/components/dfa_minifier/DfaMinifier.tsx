// Global Imports
import React, { Component, ChangeEvent, MouseEvent, Suspense, lazy } from "react"

// Local Imports
const Alphabet = lazy(() => import("./alphabet/Alphabet"))
const DfaTable = lazy(() => import("./dfa_table/DfaTable"));

interface DfaMinifierState {
    alphabet: string
    states: Array<number>
    nextState: number
}
interface DfaMinifierProps { }

class DfaMinifier extends Component<DfaMinifierProps, DfaMinifierState>{

    constructor(props: DfaMinifierProps) {
        super(props)
        this.state = {
            alphabet: "ab",
            states: [0],
            nextState: 1
        }
        this.onAlphabetChange = this.onAlphabetChange.bind(this);
        this.onStateAdd = this.onStateAdd.bind(this);
        this.onStateRemove = this.onStateRemove.bind(this);
    }
    onAlphabetChange(event: ChangeEvent<HTMLInputElement>) {
        const inputValue = Array.from(new Set(event.target.value)).filter((value) => { return value.match(/[a-z 0-9]/gi) }).join("");
        this.setState({
            alphabet: inputValue
        })
    }
    onStateRemove(state_id: number) {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            this.setState(state => {
                const newState = state.states.filter(state => state !== state_id)
                return {
                    states: newState
                }
            })
        }

    }
    onStateAdd(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        this.setState(state => {
            return {
                nextState: state.nextState + 1,
                states: [...state.states, state.nextState]
            }
        })
    }
    render() {
        const { alphabet, states } = this.state;
        return (
            <Suspense fallback={<p>Loading...</p>}>
                <Alphabet
                    onChange={this.onAlphabetChange}
                    alphabet={alphabet}
                />
                <DfaTable
                    alphabet={alphabet}
                    states={states}
                    onStateAdd={this.onStateAdd}
                    onStateRemove={this.onStateRemove}
                />
            </Suspense>
        )
    }

}

export default DfaMinifier;
