import React, { Component, ChangeEvent } from "react"

interface AlphabetProps { }
interface AlphabetState {
    alphabet: string
}

class Alphabet extends Component<AlphabetProps, AlphabetState> {
    constructor(props: AlphabetProps) {
        super(props)
        this.state = {
            alphabet: ""
        }
        this.onAlphabetChange = this.onAlphabetChange.bind(this);
    }
    onAlphabetChange(event: ChangeEvent<HTMLInputElement>) {
        const inputValue = Array.from(new Set(event.target.value)).filter((value) => { return value.match(/[a-z 0-9]/gi) }).join("");
        this.setState({
            alphabet: inputValue
        })
    }
    render() {
        const { alphabet } = this.state;
        return (
            <div>
                <label>
                    Alfabeto:
                    <input id="alphabet" name="alphabet" type="text" onChange={this.onAlphabetChange} value={alphabet} />
                </label>
            </div>
        )
    }
}

export default Alphabet