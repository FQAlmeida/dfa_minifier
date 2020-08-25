import React, { Component, Fragment } from "react"
import Container from "react-bootstrap/Container"

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
                    <Container fluid>
                        {this.props.children}
                    </Container>
                </section>
            </Fragment>
        )
    }
}

export default Base;
