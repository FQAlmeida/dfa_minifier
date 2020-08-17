import React, { Component, Fragment } from "react"

class Base extends Component {
    render() {
        return (
            <Fragment>
                <header>
                    <p>
                        dfa minifier
                    </p>
                </header>
                <div id="content">
                    {this.props.children}
                </div>
            </Fragment>
        )
    }
}

export default Base;
