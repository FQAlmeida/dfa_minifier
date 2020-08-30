// Global Imports
import React, { Component, ChangeEvent, MouseEvent, Suspense, lazy } from "react"

// Local Imports
import IEstado, { IOperacao } from "../../models/Estado";
const DfaResult = lazy(() => import("./dfa_result/DfaResult"));
const Alphabet = lazy(() => import("./alphabet/Alphabet"))
const DfaTable = lazy(() => import("./dfa_table/DfaTable"));

const initial_state: DfaMinifierState = {
    alphabet: "ab",
    states: [{
        id: "0",
        inicial: true,
        final: true,
        operacoes: [
            {
                character: "a",
                next_state_id: "",
            },
            {
                character: "b",
                next_state_id: ""
            },
        ],
    }],
    nextState: 1
}

interface DfaMinifierState {
    alphabet: string
    states: Array<IEstado>
    nextState: number
}

interface DfaMinifierProps { }

class DfaMinifier extends Component<DfaMinifierProps, DfaMinifierState>{

    constructor(props: DfaMinifierProps) {
        super(props)
        this.state = initial_state
        this.onAlphabetChange = this.onAlphabetChange.bind(this);
        this.onStateAdd = this.onStateAdd.bind(this);
        this.onStateRemove = this.onStateRemove.bind(this);
        this.onStateInicialChange = this.onStateInicialChange.bind(this)
        this.onStateFinalChange = this.onStateFinalChange.bind(this)
        this.onStateOperacaoChange = this.onStateOperacaoChange.bind(this)
    }
    onAlphabetChange(event: ChangeEvent<HTMLInputElement>) {
        const { alphabet, states } = this.state;
        const inputValue = Array.from(new Set(event.target.value)).filter((value) => { return value.match(/[a-z 0-9]/gi) });
        let updated_states: Array<IEstado>;
        if (alphabet.length > inputValue.length) {
            const removed_character = alphabet.split("").find(character => !inputValue.includes(character))
            updated_states = [
                ...states.map(state => {
                    return {
                        ...state,
                        operacoes: [
                            ...state.operacoes.filter(operacao => removed_character === undefined || operacao.character !== removed_character)
                        ]
                    }
                })
            ]
        } else {
            const added_character = inputValue.find(character => !alphabet.includes(character))
            if (added_character) {
                updated_states = [
                    ...states.map(state => {
                        return {
                            ...state,
                            operacoes: [
                                ...state.operacoes,
                                { character: added_character, next_state_id: "" }
                            ]
                        }
                    })
                ]
            } else {
                updated_states = states
            }
        }
        this.setState({
            alphabet: inputValue.join(""),
            states: updated_states
        })
    }
    onStateRemove(state_removed: IEstado) {
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
        event.preventDefault();
        const { alphabet } = this.state
        const operacoes: Array<IOperacao> = alphabet.split("").map(character => {
            return {
                character,
                next_state_id: ""
            }
        })
        this.setState(state => {
            return {
                nextState: state.nextState + 1,
                states: [...state.states, {
                    id: (state.nextState).toString(),
                    inicial: false,
                    final: false,
                    operacoes
                }]
            }
        })
    }

    onStateInicialChange(estado: IEstado) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            this.setState(state => {
                return {
                    ...state,
                    states: [
                        ...state.states.map(inner_state => inner_state.id === estado.id ? {...inner_state, inicial: true} : {...inner_state, inicial: false}),
                    ]
                }
            })
        }
    }
    onStateFinalChange(estado: IEstado) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            this.setState(state => {
                return {
                    ...state,
                    states: [
                        ...state.states.map(inner_state => inner_state.id !== estado.id ? inner_state : { ...estado, final: !estado.final }),
                    ]
                }
            })
        }

    }
    onStateOperacaoChange(estado: IEstado, character: string) {
        return (event: ChangeEvent<HTMLSelectElement>) => {
            const value = event.target.value;
            const operacoes: Array<IOperacao> = [
                ...estado.operacoes.filter(oper => oper.character !== character),
                { character, next_state_id: value }
            ]
            this.setState(state => {
                return {
                    ...state,
                    states: [
                        ...state.states.map(inner_state => inner_state.id !== estado.id ? inner_state : { ...estado, operacoes }),
                    ]
                }
            })
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
                <DfaResult
                    states={states}
                />
            </Suspense>
        )
    }

}

export default DfaMinifier;
