export interface IOperacao {
    character: string
    next_state_id: string
}

interface IEstado {
    id: string;
    inicial: boolean;
    final: boolean;
    operacoes: Array<IOperacao>;
}

export default IEstado
