import React, { Component } from "react"
import Alphabet from "./alphabet/Alphabet"

interface DfaMinifierState { alphabet:string }
interface DfaMinifierProps { }

class DfaMinifier extends Component<DfaMinifierProps, DfaMinifierState>{
    render() {
        return (
            <Alphabet />
        )
    }

}

export default DfaMinifier;
