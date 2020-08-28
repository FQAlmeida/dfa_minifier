// Global Imports
import React, { ChangeEvent, Component, MouseEvent } from "react"
import Button from "react-bootstrap/Button"
import Table from "react-bootstrap/Table"
import InputGroup from "react-bootstrap/InputGroup"
import FormControl from "react-bootstrap/FormControl"
import FormCheck from "react-bootstrap/FormCheck"
import { FcCancel, FcPlus } from "react-icons/fc"
// Local Imports
import IEstado from "../../../models/Estado";

interface DfaTableProps {
    alphabet: string
    states: Array<IEstado>
    onStateAdd: (event: MouseEvent<HTMLButtonElement>) => void
    onStateRemove: (state: IEstado) => (event: MouseEvent<HTMLButtonElement>) => void
    onStateInicialChange: (state: IEstado) => (event: ChangeEvent<HTMLInputElement>) => void
    onStateFinalChange: (state: IEstado) => (event: ChangeEvent<HTMLInputElement>) => void
    onStateOperacaoChange: (state: IEstado, character: string) => (event: ChangeEvent<HTMLSelectElement>) => void
}

class DfaTable extends Component<DfaTableProps> {
    render() {
        const { alphabet, states, onStateAdd, onStateRemove, onStateOperacaoChange, onStateFinalChange, onStateInicialChange } = this.props;
        return (
            <Table striped bordered responsive >
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
                                        <InputGroup>
                                            <FormControl onChange={onStateOperacaoChange(state, character)} as="select">
                                                <option key={0} value="">-</option>
                                                {states.map((opt_state, index) => {
                                                    return (
                                                        <option key={index + 1} value={opt_state.id}>
                                                            Estado {opt_state.id}
                                                        </option>
                                                    )
                                                })}
                                            </FormControl>
                                        </InputGroup>
                                    </td>
                                })}
                                <td>
                                    <InputGroup>
                                        <FormCheck type="radio" name="inicial" aria-label="check-inicial" onChange={onStateInicialChange(state)} checked={state.inicial} />
                                    </InputGroup>
                                </td>
                                <td>
                                    <InputGroup>
                                        <FormCheck type="checkbox" aria-label="check-final" onChange={onStateFinalChange(state)} checked={state.final} />
                                    </InputGroup>
                                </td>
                                <td>
                                    <Button variant="outline-danger" onClick={onStateRemove(state)} ><FcCancel /></Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={alphabet.length + 4}>
                            <Button variant="outline-success" onClick={onStateAdd}><FcPlus /></Button>
                        </td>
                    </tr>
                </tfoot>
            </Table>
        )
    }
}
export default DfaTable;
