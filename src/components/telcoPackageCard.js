import React, { Component } from "react";
import packageCardStyles from "./packageCard.module.css";

class TelcoPackageCard extends Component {
  state = {};
  render() {
    return (
      <div
        className={`d-flex justify-content-between mt-2 mb-4 p-2 ${
          this.props.onClick ? packageCardStyles.bundleBox1 : ``
        }`}
        id={`${packageCardStyles.bundleBox}`}
        style={{
          cursor: !this.props.onClick ? `` : `pointer`,
        }}
        onClick={() => {
          if (this.props.onClick) this.props.onClick();
        }}
      >
        <div>
          <div className={`d-flex justify-content-between `}>
            <div className="d-flex flex-row justify-content-start align-items-center">
            <div className="mr-2">
                <img src="https://i.imgur.com/rcZCliB.png"/>
            </div>
              <div className="">
                <span
                  className={`${packageCardStyles.payByMobile}`}
                >{`Pay by Mobile`}</span>
                <p>{`Subscribe Daily Package`}</p>
              </div>
            </div>
          </div>
          {/* <div
            className={`d-flex justify-content-between flex-wrap align-items-center mt-3`}
          >
            {this.props.telco === "mobilink" ? (
              <div
                className={`d-flex justify-content-center align-items-center mr-3`}
              >
                <img
                  src="https://asset.cricvids.co/cricwick-assets/images/telcos/jazz_logo.png"
                  alt=""
                  width={70}
                  height={35}
                />
              </div>
            ) : (
              <React.Fragment>
                <div
                  className={`d-flex justify-content-center align-items-center mr-3`}
                >
                  <img
                    src="https://asset.cricvids.co/cricwick-assets/images/telcos/telenor_logo.png"
                    alt=""
                    width={70}
                    height={35}
                  />
                </div>

                <div
                  className={`d-flex justify-content-center align-items-center mr-3`}
                >
                  <img
                    src="https://asset.cricvids.co/cricwick-assets/images/telcos/ufone_logo.png"
                    alt=""
                    width={70}
                    height={35}
                  />
                </div>

                <div
                  className={`d-flex justify-content-center align-items-center mr-3`}
                >
                  <img
                    src="https://asset.cricvids.co/cricwick-assets/images/telcos/zong_logo.png"
                    alt=""
                    width={70}
                    height={35}
                  />
                </div>
              </React.Fragment>
            )}
          </div> */}
        </div>
        <div className={`d-flex justify-content-center align-items-center`}>
          <span className="">
            {/* <i className="fa fa-chevron-right" /> */}
            <svg xmlns="http://www.w3.org/2000/svg" width="7.05" height="12" viewBox="0 0 7.05 12">
                <path id="Shape" d="M11.55,6,6.6,1.05,7.65,0l6,6-6,6L6.6,10.95,11.55,6Z" transform="translate(-6.6)" fill="#5b5b5b"/>
            </svg>
          </span>
        </div>
      </div>
    );
  }
}

export default TelcoPackageCard;
