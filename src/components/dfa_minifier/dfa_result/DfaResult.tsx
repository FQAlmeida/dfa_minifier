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
            return `"${state_id}" -> "${operacao.next_state_id}" [ label="${operacao.character}" ];`
        }).join("\n")
    }
    statesToDotString(states: Array<IEstado>): string {
        let states_id = states.map(state => {
            const label = state.final ? " [shape=doublecircle]" : " [shape=circle]"
            return `"${state.id}"${label};\n${this.operacoesToDotString(state.id, state.operacoes)}`;
        }).join("\n")
        const id_inicial = states.findIndex(inner_state => inner_state.inicial)

        if (id_inicial !== -1) {
            console.log(id_inicial);
            states_id += `
            "" [shape=none];
            "" -> "${states[id_inicial].id}";`
        }
        return (
            `digraph {
                ${states_id}
            }`)
    }
    minifyStates(unminified_states: Array<IEstado>): Array<IEstado> {
        console.log("-------------------------------------------")

        let bfs_queue: Array<IEstado> = new Array<IEstado>();
        let reachable_states: Array<IEstado> = new Array<IEstado>();
        let index_initial_state = unminified_states.findIndex(inner_state => inner_state.inicial === true)
        reachable_states.push(unminified_states[index_initial_state])
        
        for(let i = 0; i < unminified_states[index_initial_state].operacoes.length; i++) {
            if(unminified_states[index_initial_state].operacoes[i].next_state_id !== "") {
                let index_next_state = unminified_states.findIndex(inner_state => inner_state.id === unminified_states[index_initial_state].operacoes[i].next_state_id)
                if(!reachable_states.includes(unminified_states[index_next_state])) {
                    reachable_states.push(unminified_states[index_next_state])
                    bfs_queue.push(unminified_states[index_next_state])
                }
            }
        }

        while(bfs_queue.length > 0) {
            let current_state = bfs_queue.pop()
            let index_current_state = unminified_states.findIndex(inner_state => inner_state.id === current_state?.id)
                for (let i=0; i < unminified_states[index_current_state].operacoes.length; i++) {
                    if(unminified_states[index_current_state].operacoes[i].next_state_id !== "") {
                        let index_next_state = unminified_states.findIndex(inner_state => inner_state.id === unminified_states[index_current_state].operacoes[i].next_state_id)
                        if(!reachable_states.includes(unminified_states[index_next_state])) {
                            reachable_states.push(unminified_states[index_next_state])
                            bfs_queue.push(unminified_states[index_next_state])
                        }
                    }
                }
        }

        reachable_states.sort((a,b) => parseInt(a.id) - parseInt(b.id))
        const minified_states: Array<IEstado> = new Array<IEstado>();
        const matrix_aux: Array<linha_matriz_aux> = new Array<linha_matriz_aux>();
        for (let i = 0; i < reachable_states.length - 1; i++) {
            matrix_aux.push({ id: reachable_states[i + 1].id, cols: new Array<col_matriz_aux>() });
            for (let j = 0; j < i + 1; j++) {
                matrix_aux[i].cols.push({ id: reachable_states[j].id, valor: false, pares: new Array<par>() });
            }
        }
        console.log("Matriz Inicial:")
        console.log("Linhas da Matriz Auxiliar:")
        console.table(matrix_aux)

        for(let i = 0; i < matrix_aux.length; i++) {
            console.log("Elementos da Linha: " + i)
            console.table(matrix_aux[i].cols)
        }
        console.log("-------------------------------------------")
        for (let i = 1; i < reachable_states.length; i++) {
            for (let j = 0; j < reachable_states.length; j++) {
                if (reachable_states[i].final !== reachable_states[j].final) {
                    let matrix_index_i = matrix_aux.findIndex(inner_state => inner_state.id === reachable_states[i].id)
                    let matrix_index_j = matrix_aux[matrix_index_i].cols.findIndex(inner_state => inner_state.id === reachable_states[j].id)
                    if (matrix_index_j === -1 || matrix_index_i === -1) {
                        matrix_index_i = matrix_aux.findIndex(inner_state => inner_state.id === reachable_states[j].id)
                        matrix_index_j = matrix_aux[matrix_index_i].cols.findIndex(inner_state => inner_state.id === reachable_states[i].id)
                    }
                    matrix_aux[matrix_index_i].cols[matrix_index_j].valor = true
                }
            }
        }
        console.log("Matriz Marcada <Final, Não-Final>:")
        console.log("Linhas da Matriz Auxiliar:")
        console.table(matrix_aux)

        for(let i = 0; i < matrix_aux.length; i++) {
            console.log("Elementos da Linha: " + i)
            console.table(matrix_aux[i].cols)
        }
        console.log("-------------------------------------------")
        for (let i = 0; i < matrix_aux.length; i++) {
            for (let j = 0; j < matrix_aux[i].cols.length; j++) {
                if (matrix_aux[i].cols[j].valor === false) {
                    const state_index_i = reachable_states.findIndex(inner_state => inner_state.id === matrix_aux[i].id);
                    const state_index_j = reachable_states.findIndex(inner_state => inner_state.id === matrix_aux[i].cols[j].id);

                    for (let v = 0; v < reachable_states[state_index_i].operacoes.length; v++) {
                        if (reachable_states[state_index_i].operacoes[v].next_state_id !== "") {
                            const oper_index_k = reachable_states[state_index_j].operacoes.findIndex(operacao => operacao.character === reachable_states[state_index_i].operacoes[v].character)
                            const state_g_to_find = reachable_states[state_index_i].operacoes[v].next_state_id
                            let matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === state_g_to_find)
                            if (matrix_index_g !== -1 && reachable_states[state_index_j].operacoes[oper_index_k].next_state_id !== "") {
                                const state_h_to_find = reachable_states[state_index_j].operacoes[oper_index_k].next_state_id
                                if (state_h_to_find !== state_g_to_find) {
                                    let matrix_index_h = matrix_aux[matrix_index_g].cols.findIndex(inner_state => inner_state.id === state_h_to_find)
                                    if (matrix_index_h === -1) {
                                        matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === state_h_to_find)
                                        matrix_index_h = matrix_aux[matrix_index_g].cols.findIndex(inner_state => inner_state.id === state_g_to_find)
                                    }

                                    if (matrix_aux[matrix_index_g].cols[matrix_index_h].valor) {
                                        matrix_aux[i].cols[j].valor = true;
                                        for (let t = 0; t < matrix_aux[matrix_index_g].cols[matrix_index_h].pares.length; t++) {
                                            const state_index_u = reachable_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[matrix_index_h].pares[t].estado_x);
                                            const state_index_p = reachable_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[matrix_index_h].pares[t].estado_y);
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
        console.log("Matriz Final:")
        console.log("Linhas da Matriz Auxiliar:")
        console.table(matrix_aux)

        for(let i = 0; i < matrix_aux.length; i++) {
            console.log("Elementos da Linha: " + i)
            console.table(matrix_aux[i].cols)
        }
        console.log("-------------------------------------------")

        const estados_visitados = new Array<string>();
        const estados_minizados = new Array<string>();
        for (let s = reachable_states.length - 1; s >= 0; s--) {
            if (!estados_visitados.includes(reachable_states[s].id)) {
                estados_visitados.push(reachable_states[s].id)
                const estado_aux: IEstado = { ...reachable_states[s] }
                const matrix_index_g = matrix_aux.findIndex(inner_state => inner_state.id === reachable_states[s].id)
                if (matrix_index_g !== -1) {
                    for (let w = 0; w < matrix_aux[matrix_index_g].cols.length; w++) {
                        if (matrix_aux[matrix_index_g].cols[w].valor === false) {
                            const matrix_index_z = reachable_states.findIndex(inner_state => inner_state.id === matrix_aux[matrix_index_g].cols[w].id)
                            estados_visitados.push(reachable_states[matrix_index_z].id)
                            estado_aux.id = `${estado_aux.id}_${reachable_states[matrix_index_z].id}`
                            estado_aux.inicial = estado_aux.inicial || reachable_states[matrix_index_z].inicial
                            estado_aux.final = estado_aux.final || reachable_states[matrix_index_z].final
                        }
                    }
                }
                estados_minizados.push(estado_aux.id)
                minified_states.push(estado_aux);
            }
        }
        for (let i = 0; i < minified_states.length; i++) {
            const state = minified_states[i]
            for (let j = 0; j < state.operacoes.length; j++) {
                const operacao = state.operacoes[j]
                if (operacao.next_state_id !== "") {
                    if (!estados_minizados.includes(operacao.next_state_id)) {
                        for (let k = 0; k < estados_minizados.length; k++) {
                            if (estados_minizados[k].includes(operacao.next_state_id)) {
                                minified_states[i].operacoes[j].next_state_id = estados_minizados[k]
                            }
                        }
                    }
                }
            }
        }
        return minified_states.reverse()
    }
    render() {
        const { states } = this.props
        const inner_states = [...states.map(inner_state => { return { ...inner_state, operacoes: [...inner_state.operacoes.map(oper => { return { ...oper } })] } })]
        let minified_states: Array<IEstado>;
        try {
            minified_states = this.minifyStates(inner_states)

        } catch (err) {
            console.error(err)
            minified_states = states

        }

        const dot_string_min = this.statesToDotString(minified_states);
        // const dot_string = this.statesToDotString(inner_states);

        return (
            <Fragment>
                <p>Result should be here</p>
                <Graphviz dot={
                    dot_string_min
                } />
            </Fragment>
        )
    }
}

export default DfaResult
