// Global Imports
import React, { ChangeEvent, Component, MouseEvent } from "react"
// Local Imports
import Estado from "../../../models/Estado";

interface DfaTableProps {
    alphabet: string
    states: Array<Estado>
    onStateAdd: (event: MouseEvent<HTMLButtonElement>) => void
    onStateRemove: (state: Estado) => (event: MouseEvent<HTMLButtonElement>) => void
    onStateInicialChange: (state: Estado) => (event: ChangeEvent<HTMLInputElement>) => void
    onStateFinalChange: (state: Estado) => (event: ChangeEvent<HTMLInputElement>) => void
    onStateOperacaoChange: (state: Estado, character: string) => (event: ChangeEvent<HTMLSelectElement>) => void
}

class DfaTable extends Component<DfaTableProps> {
    render() {
        const { alphabet, states, onStateAdd, onStateRemove, onStateOperacaoChange, onStateFinalChange, onStateInicialChange } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        <th>Estados</th>
                        {alphabet.split("").map((letter, index) => {
                            return <th key={index}>{letter}</th>
                        })}
                        <th>Inicial</th>
                        <th>Final</th>
                        <th>Remover</th>
                    </tr>
                </thead>
                <tbody>
                    {states.map((state, index) => {
                        return (
                            <tr key={index}>
                                <td >Estado {state.id}</td>
                                {alphabet.split("").map((character, index) => {
                                    return <td key={index}>
                                        <select onChange={onStateOperacaoChange(state, character)}>
                                            <option key={0} value={-1}>-</option>
                                            {states.map((opt_state, index) => {
                                                return (
                                                    <option key={index + 1} value={opt_state.id}>
                                                        Estado {opt_state.id}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </td>
                                })}
                                <td>
                                    <input type="radio" name="inicial" onChange={onStateInicialChange(state)} />
                                </td>
                                <td>
                                    <input type="checkbox" onChange={onStateFinalChange(state)} />
                                </td>
                                <td>
                                    <button onClick={onStateRemove(state)}>X</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <button onClick={onStateAdd}>Add</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        )
    }
}
export default DfaTable;
