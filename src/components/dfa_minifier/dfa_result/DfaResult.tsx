// Global Imports
import React, { Component, Fragment } from "react"
import { Graphviz } from "graphviz-react"
// Local Imports
import IEstado, { IOperacao } from "../../../models/Estado"
import { log } from "console";

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
            return `${state_id}->${operacao.next_state_id}[ label="${operacao.character}" ];`
        }).join("")
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
            matrix_aux.push({ id: unminified_states[i + 1].id, cols: new Array<col_matriz_aux>() });
            for (let j = 0; j < i + 1; j++) {
                matrix_aux[i].cols.push({ id: unminified_states[j].id, valor: false, pares: new Array<par>() });
            }
        }
        for (let i = 1; i < unminified_states.length; i++) {
            for (let j = 0; j < unminified_states.length; j++) {
                if (unminified_states[i].final !== unminified_states[j].final) {
                    let matrix_index_i = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[i].id)
                    let matrix_index_j = matrix_aux[matrix_index_i].cols.findIndex(inner_state => inner_state.id === unminified_states[j].id)
                    if (matrix_index_j === -1 || matrix_index_i === -1) {
                        matrix_index_i = matrix_aux.findIndex(inner_state => inner_state.id === unminified_states[j].id)
                        matrix_index_j = matrix_aux[matrix_index_i].cols.findIndex(inner_state => inner_state.id === unminified_states[i].id)
                    }
                    matrix_aux[matrix_index_i].cols[matrix_index_j].valor = true
                }
            }
        }
        for (let i = 0; i < matrix_aux.length; i++) {
            for (let j = 0; j < matrix_aux[i].cols.length; j++) {
                if (matrix_aux[i].cols[j].valor === false) {
                    const state_index_i = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[i].id);
                    const state_index_j = unminified_states.findIndex(inner_state => inner_state.id === matrix_aux[i].cols[j].id);

                    for (let v = 0; v < unminified_states[state_index_i].operacoes.length; v++) {
                        if (unminified_states[state_index_i].operacoes[v].next_state_id !== "") {
                            const oper_index_k = unminified_states[state_index_j].operacoes.findIndex(operacao => operacao.character === unminified_states[state_index_i].operacoes[v].character)
                            const state_g_to_find = unminified_states[state_index_i].operacoes[v].next_state_id
                            let matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === state_g_to_find)
                            if (matrix_index_g !== -1 && unminified_states[state_index_j].operacoes[oper_index_k].next_state_id !== "") {
                                const state_h_to_find = unminified_states[state_index_j].operacoes[oper_index_k].next_state_id
                                if (state_h_to_find !== state_g_to_find) {
                                    let matrix_index_h = matrix_aux[matrix_index_g].cols.findIndex(inner_state => inner_state.id === state_h_to_find)
                                    if (matrix_index_h === -1) {
                                        matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === state_h_to_find)
                                        matrix_index_h = matrix_aux[matrix_index_g].cols.findIndex(inner_state => inner_state.id === state_g_to_find)
                                    }
                                    console.log(i, j, matrix_index_g, matrix_index_h);

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
            }
        }
        console.log(matrix_aux);

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
                            estado_aux.id = `${estado_aux.id}${unminified_states[matrix_index_z].id}`
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
        const inner_states = [...states.map(inner_state => { return { ...inner_state } })]
        let minified_states: Array<IEstado>;
        try {
            minified_states = this.minifyStates(inner_states)

        } catch (err) {
            console.error(err)
            minified_states = inner_states

        }
        console.log(states, inner_states, minified_states)

        const dot_string_min = this.statesToDotString(minified_states);
        const dot_string = this.statesToDotString(inner_states);
        console.log(dot_string_min);

        return (
            <Fragment>
                <p>Result should be here</p>
                <Graphviz dot={
                    dot_string
                } />
                <Graphviz dot={
                    dot_string_min
                } />
            </Fragment>
        )
    }
}

export default DfaResult
