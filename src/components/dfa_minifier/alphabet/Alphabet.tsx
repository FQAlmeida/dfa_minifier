import React, { Component, ChangeEvent } from "react"

interface AlphabetProps {
    alphabet: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
 }
interface AlphabetState {
}

class Alphabet extends Component<AlphabetProps, AlphabetState> {
    
    render() {
        const { alphabet, onChange } = this.props;
        return (
            <div>
                <label>
                    Alfabeto:
                    <input id="alphabet" name="alphabet" type="text" onChange={onChange} value={alphabet} />
                </label>
            </div>
        )
    }
}

export default Alphabet