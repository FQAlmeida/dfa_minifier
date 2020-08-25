import React, { Component, ChangeEvent } from "react"
import InputGroup from "react-bootstrap/FormGroup"
import FormControl from "react-bootstrap/FormControl"
import FormLabel from "react-bootstrap/FormLabel"

interface AlphabetProps {
    alphabet: string
    onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

interface AlphabetState { }

class Alphabet extends Component<AlphabetProps, AlphabetState> {

    render() {
        const { alphabet, onChange } = this.props;
        return (
            <InputGroup>
                <FormLabel>
                    Alfabeto:
                </FormLabel>
                <FormControl id="alphabet" name="alphabet" type="text" onChange={onChange} value={alphabet} />
            </InputGroup>
        )
    }
}

export default Alphabet