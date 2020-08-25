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
                <section id="content">
                    {this.props.children}
                </section>
            </Fragment>
        )
    }
}

export default Base;
