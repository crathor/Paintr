import React, { Component, Fragment } from "react";
import "./modal.css";
import Backdrop from "./Backdrop";

class Modal extends Component {
  render() {
    return (
      <Fragment>
        <Backdrop show={this.props.show} clicked={this.props.close} />

        <div
          className="Modal"
          style={{
            transform: this.props.show ? "scale(1)" : "scale(0)",
            opacity: this.props.show ? "1" : "0"
          }}
        >
          {this.props.children}
        </div>
      </Fragment>
    );
  }
}

export default Modal;
