export interface IOperacao {
    character: string
    next_state_id: number
}

interface IEstado {
    id: number;
    inicial: boolean;
    final: boolean;
    operacoes: Array<IOperacao>;
}

export default IEstado
