// Global Imports
import React, { Component, Fragment } from "react"
import { Graphviz } from "graphviz-react"
// Local Imports
import IEstado, { IOperacao } from "../../../models/Estado"

interface IDfaResultProps {
    states: Array<IEstado>
}
interface IDfaResultState {

}

interface linha_matriz_aux {
    id: string,
    cols: Array<col_matriz_aux>
}

interface col_matriz_aux {
    id: string
    valor: boolean
    pares: Array<par>
}

interface par {
    estado_x: string
    estado_y: string
}

class DfaResult extends Component<IDfaResultProps, IDfaResultState> {
    constructor(props: IDfaResultProps) {
        super(props);
        this.operacoesToDotString = this.operacoesToDotString.bind(this);
        this.statesToDotString = this.statesToDotString.bind(this);
    }

    operacoesToDotString(state_id: string, operacoes: Array<IOperacao>): string {
        return operacoes.filter(operacao => operacao.next_state_id !== "").map(operacao => {
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
    minifyStates(unminified_states: Array<IEstado>): Array<IEstado> {
        console.log("-------------------------------------------")
        const minified_states: Array<IEstado> = new Array<IEstado>();
        const matrix_aux: Array<linha_matriz_aux> = new Array<linha_matriz_aux>();
        for (let i = 0; i < unminified_states.length - 1; i++) {
            matrix_aux.push({ id: unminified_states[i].id, cols: new Array<col_matriz_aux>() });
            for (let j = 0; j < i + 1; j++) {
                matrix_aux[i].cols.push({ id: unminified_states[j + 1].id, valor: false, pares: new Array<par>() });
            }
        }
        for (let i = 0; i < unminified_states.length; i++) {
            for (let j = i; j < unminified_states.length; j++) {
                if (unminified_states[i].final !== unminified_states[j].final) {
                    const matrix_index_i = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[i].id)
                    const matrix_index_j = matrix_aux[matrix_index_i].cols.findIndex(inner_state => inner_state.id === unminified_states[j].id)
                    matrix_aux[matrix_index_i].cols[matrix_index_j].valor = true
                    if (matrix_index_i !== 0 && matrix_index_j !== matrix_aux.length - 1) {
                        matrix_aux[matrix_index_i].cols[matrix_index_j].valor = true
                    }
                }
            }
        }
        for (let i = 0; i < matrix_aux.length; i++) {
            for (let j = i; j < matrix_aux[i].cols.length; j++) {
                if (matrix_aux[i].cols[j].valor === false) {
                    const state_index_i = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[i].id);
                    const state_index_j = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[i].cols[j].id);
                    for (let v = 0; v < unminified_states[state_index_i].operacoes.length; v++) {
                        if (unminified_states[state_index_i].operacoes[v].next_state_id !== "") {
                            const oper_index_k = unminified_states[state_index_j].operacoes.findIndex(operacao => operacao.character === unminified_states[state_index_i].operacoes[v].character)
                            const matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[state_index_i].operacoes[v].next_state_id)
                            const matrix_index_h = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[state_index_j].operacoes[oper_index_k].next_state_id)
                            if (matrix_aux[matrix_index_g].cols[matrix_index_h].valor) {
                                matrix_aux[i].cols[j].valor = true;
                                for (let t = 0; t < matrix_aux[matrix_index_g].cols[matrix_index_h].pares.length; t++) {
                                    const state_index_u = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[matrix_index_h].pares[t].estado_x);
                                    const state_index_p = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[matrix_index_h].pares[t].estado_y);
                                    matrix_aux[state_index_u].cols[state_index_p].valor = true
                                }
                                break
                            } else {
                                matrix_aux[matrix_index_g].cols[matrix_index_h].pares.push({ estado_x: state_index_i.toString(), estado_y: state_index_j.toString() })
                            }
                        }
                    }
                }
            }
        }
        const estados_visitados = new Array<string>();
        const estados_minizados = new Array<{ new_id: string, old_ids: Array<string> }>();
        for (let s = 0; s < unminified_states.length; s++) {
            if (!estados_visitados.includes(unminified_states[s].id)) {
                const estado_aux: IEstado = { ...unminified_states[s] }
                estados_visitados.push(unminified_states[s].id)
                const matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[s].id)
                if (matrix_index_g !== -1) {
                    for (let w = 0; w < matrix_aux[matrix_index_g].cols.length; w++) {
                        if (matrix_aux[matrix_index_g].cols[w].valor === false) {
                            const matrix_index_z = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[w].id)
                            estados_visitados.push(unminified_states[matrix_index_z].id)
                            estado_aux.id = `${estado_aux.id} # ${unminified_states[matrix_index_z].id}`
                            estado_aux.inicial = estado_aux.inicial || unminified_states[matrix_index_z].inicial
                        }
                    }
                }
                minified_states.push(estado_aux);
            }
        }
        return minified_states
    }
    render() {
        const { states } = this.props
        const inner_states = [...states.map(inner_state => {return {...inner_state}})]
        console.log(states, inner_states)
        const minified_states = this.minifyStates(inner_states)
        const dot_string = this.statesToDotString(minified_states);

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
