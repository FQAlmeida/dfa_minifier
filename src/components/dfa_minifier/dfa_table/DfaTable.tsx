import React, { Component, MouseEvent } from "react"

interface DfaTableProps {
    alphabet: string
    states: Array<number>
    onStateAdd: (event: MouseEvent<HTMLButtonElement>) => void
    onStateRemove: (state: number) => (event: MouseEvent<HTMLButtonElement>) => void
}

class DfaTable extends Component<DfaTableProps> {
    render() {
        const { alphabet, states, onStateAdd, onStateRemove } = this.props;
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
                                <td >Estado {state}</td>
                                {alphabet.split("").map((_, index) => {
                                    return <td key={index}>
                                        <select >
                                            <option>-</option>
                                            {states.map((opt_state, index) => {
                                                return (
                                                    <option key={index}>
                                                        Estado {opt_state}
                                                    </option>
                                                )
                                            })}
                                        </select>
                                    </td>
                                })}
                                <td>
                                    <input type="radio" name="inicial" />
                                </td>
                                <td>
                                    <input type="checkbox" />
                                </td>
                                <td>
                                    <button onClick={onStateRemove(state)}>X</button>
                                </td>
                            </tr>
                        )
                    })}
                    <tfoot>
                        <tr>
                            <td>
                                <button onClick={onStateAdd}>Add</button>
                            </td>
                        </tr>
                    </tfoot>
                </tbody>
            </table>
        )
    }
}
export default DfaTable;
