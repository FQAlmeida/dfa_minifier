// Global Imports
import React, { Component, Fragment } from "react"
import { Graphviz } from "graphviz-react"
// Local Imports
import IEstado, { IOperacao } from "../../../models/Estado"

interface IDfaResultProps {
    states: Array<IEstado>
}
interface IDfaResultState { }

class DfaResult extends Component<IDfaResultProps, IDfaResultState> {
    operacoesToDotString(state_id: number, operacoes: Array<IOperacao>): string {
        return operacoes.filter(operacao => operacao.next_state_id !== -1).map(operacao => {
            return `${state_id}->${operacao.next_state_id}[ label="${operacao.character}" ]`
        }).join(";\n")
    }
    statesToDotString(states: Array<IEstado>): string {
        const states_id = states.map(state => {
            return `${state.id};\n${this.operacoesToDotString(state.id, state.operacoes)}`;
        }).join("\n")
        return (
            `digraph {
${states_id}
}`)
    }
    render() {
        const { states } = this.props
        const dot_string = this.statesToDotString(states);
        console.log(dot_string);

        return (
            <Fragment>
                <p>Result should be here</p>
                <Graphviz dot={
                    dot_string
                } />
            </Fragment>
        )
    }
}

export default DfaResult
