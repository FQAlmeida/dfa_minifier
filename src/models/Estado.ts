interface IOperacao {
    character: string
    next_state_id: number
}
class Estado {
    private _id: number = -1;
    private _inicial: boolean = false;
    private _final: boolean = false;
    private _operacoes: Array<IOperacao>;
    constructor(id: number, inicial: boolean, final: boolean) {
        this.id = id;
        this.inicial = inicial;
        this.final = final;
        this._operacoes = new Array<IOperacao>();
    }

    get id(): number {
        return this._id
    }

    set id(id: number){
        this._id = id;
    }
    get inicial(): boolean {
        return this._inicial
    }

    set inicial(inicial: boolean){
        this._inicial = inicial;
    }
    get final(): boolean {
        return this._final
    }

    set final(final: boolean){
        this._final = final;
    }

    get operacoes():Array<IOperacao>{
        return this._operacoes
    }

    public alter_operacao(operacao: IOperacao){
        for(let index = 0; index < this.operacoes.length; index++){
            if(this.operacoes[index].character === operacao.character){
                this.operacoes[index].next_state_id = operacao.next_state_id;
                return;
            }
        }
        this._operacoes.push(operacao);
    }
}

export default Estado
