// Global Imports
import React, { Component, ChangeEvent, MouseEvent, Suspense, lazy } from "react"

// Local Imports
import Estado from "../../models/Estado";
const Alphabet = lazy(() => import("./alphabet/Alphabet"))
const DfaTable = lazy(() => import("./dfa_table/DfaTable"));

interface DfaMinifierState {
    alphabet: string
    states: Array<Estado>
    nextState: number
}
interface DfaMinifierProps { }

class DfaMinifier extends Component<DfaMinifierProps, DfaMinifierState>{

    constructor(props: DfaMinifierProps) {
        super(props)
        // TODO: Add initial empty operations
        const initial_states = [new Estado(0, false, false)]
        const initial_alphabet = "ab"
        const initial_next_state = 1
        this.state = {
            alphabet: initial_alphabet,
            states: initial_states,
            nextState: initial_next_state
        }
        this.onAlphabetChange = this.onAlphabetChange.bind(this);
        this.onStateAdd = this.onStateAdd.bind(this);
        this.onStateRemove = this.onStateRemove.bind(this);
        this.onStateInicialChange = this.onStateInicialChange.bind(this)
        this.onStateFinalChange = this.onStateFinalChange.bind(this)
        this.onStateOperacaoChange = this.onStateOperacaoChange.bind(this)
    }
    onAlphabetChange(event: ChangeEvent<HTMLInputElement>) {
        // TODO: Add initial empty operations to states
        const inputValue = Array.from(new Set(event.target.value)).filter((value) => { return value.match(/[a-z 0-9]/gi) }).join("");
        this.setState({
            alphabet: inputValue
        })
    }
    onStateRemove(state_removed: Estado) {
        return (event: MouseEvent<HTMLButtonElement>) => {
            event.preventDefault();
            this.setState(state => {
                const newState = state.states.filter(state => state.id !== state_removed.id)
                return {
                    states: newState
                }
            })
        }

    }
    onStateAdd(event: MouseEvent<HTMLButtonElement>) {
        // TODO: Add initial empty operations
        event.preventDefault();

        this.setState(state => {
            return {
                nextState: state.nextState + 1,
                states: [...state.states, new Estado(state.nextState, false, false)]
            }
        })
    }

    onStateInicialChange(estado: Estado) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            estado.inicial = event.target.value ? true : false;
        }

    }
    onStateFinalChange(estado: Estado) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            estado.final = event.target.value ? true : false;
        }

    }
    onStateOperacaoChange(estado: Estado, character: string) {
        return (event: ChangeEvent<HTMLSelectElement>) => {
            estado.alter_operacao({character, next_state_id: parseInt(event.target.value)})
        }

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
                    onStateInicialChange={this.onStateInicialChange}
                    onStateFinalChange={this.onStateFinalChange}
                    onStateOperacaoChange={this.onStateOperacaoChange}
                />
            </Suspense>
        )
    }

}

export default DfaMinifier;
