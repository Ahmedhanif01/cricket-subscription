import React, { Component } from "react";
import packageCardStyles from "./packageCard.module.css";

class PayByOption extends Component {
  render() {
    return (
      <div
        className={`d-flex mt-2 mb-4 p-4 position-relative ${
          this.props.parentClasses && this.props.parentClasses.length
            ? this.props.parentClasses
            : ""
        } ${
          this.props.selected
            ? packageCardStyles.bundleBox1Selected
            : packageCardStyles.bundleBox1
        }`}
        id={`${packageCardStyles.bundleBox}`}
        style={{
          cursor: `pointer`,
        }}
        onClick={() => {
          if (this.props.onCardClick) this.props.onCardClick();
        }}
      >
        <div className="mr-2 d-flex justify-content-center align-items-center">
          <img
            src="https://i.imgur.com/VZt9ykH.png"
            alt={"Card"}
            width={"30px"}
            height={"30px"}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <span className={`${packageCardStyles.packageDuration}`}>
            {this.props.option && this.props.option.title
              ? `Pay by ${this.props.option.title}`
              : ``}
          </span>
        </div>
        {this.props.selected ? (
          <span
            className={"position-absolute"}
            style={{
              top: 0,
              right: 0,
              color: "green",
            }}
          >
            {/* <i className="fa fa-check-circle" /> */}
          </span>
        ) : null}
      </div>
    );
  }
}

export default PayByOption;
