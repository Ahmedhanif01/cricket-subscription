import axios from "axios";
import React, { Component } from "react";
import PackageCard from "./packageCard";
import TelcoPackageCard from "./telcoPackageCard";
import { Globals } from "../constants";
import Loading from "./Loading";
import packageCardStyles from "./packageCard.module.css";
import { withRouter } from "react-router";
const queryString = require("query-string");

class SubscriptionPlans extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.callGoogleEvent = this.callGoogleEvent.bind(this);
    this.state = {
      isLoading: true,
      plans: null,
      plans2: null,
      plans3: null,
      expanded: true,
      fromInvite: false,
      phone: this.props.match.params.phoneNumber,
      isJazzEnabled: false,
      telcoName: ""
    };
  }

  subscriptionTypes = [
    "daily",
    "weekly",
    "monthly",
    "biweekly",
    "monthly",
    "months",
    "year",
  ];

  
   callGoogleEvent(eventName) {
    window.gtag("event", eventName);
  }


 handleClick = () => {
      this.callGoogleEvent("MWEB_LINK_SUBSCRN_PBM")
      return this.props.history.push("/payment-options")
  }

  getPlansFromApi = async (pkg_type = 1, stateVar = "plans") => {
    let apiurl = `${Globals.NodeApi}api/get_packages?pkg_type=${pkg_type}&app_name=CricwickWeb`;

    try {
      let response = await axios.get(apiurl);
      this.setState({
        [stateVar]: response.data.remote_response.data.packages,
        isLoading: false,
      });
    } catch (error) {
      console.log(`Cannot get plans: `, error);
    }
  };

  getTelcoPackages = async (phoneNumber) => {
    let apiurl = `${Globals.NodeApi}api/get_telco_packages?phone=${phoneNumber}&app_name=CricwickWeb`;

    try {
      let response = await axios.get(apiurl);
      console.log("response",response)
      localStorage.setItem("price_points", JSON.stringify(response.data.remote_response.price_points))
      localStorage.setItem("telco_name", response.data.remote_response.telco_name)
      this.setState({
        isJazzEnabled: response.data.remote_response.is_jazz_enabled,
        telcoName: response.data.remote_response.telco_name
      })

    } catch (error) {
      console.log(`Cannot get plans: `, error);
    }
  };

  async componentDidMount() {
    // debugger;
    if(this.props.match.params.phoneNumber !== undefined && this.props.match.params.appName !== undefined){
      console.log("response 85",this.state.phone);
      localStorage.setItem("phoneNumber", this.props.match.params.phoneNumber)
      localStorage.setItem("appName", this.props.match.params.appName)
      this.getTelcoPackages(this.props.match.params.phoneNumber);
    } else {
      console.log("response 90",this.state.phone);
        this.getTelcoPackages(this.props.match.params.phoneNumber);
        // localStorage.setItem("phoneNumber", this.props.match.params.phoneNumber)
    }
    this.getPlansFromApi(1);
    this.getPlansFromApi(2, "plans2");
    this.getPlansFromApi(3, "plans3");
    let parsed = queryString.parse(this.props.location.search);
    if (parsed.fromInvite)
      this.setState({
        fromInvite: true,
      });
    // if (this.props.changeSubscription) {
    //   let user =
    //     localStorage.getItem("user") &&
    //     JSON.parse(localStorage.getItem("user"));

    //   this.setState({
    //     subscriptionType: user.subscriptionType,
    //     paymentType: user.paymentType,
    //   });
    // }
  }

 

  render() {
      console.log("response",this.state.isJazzEnabled, this.state.telcoName)
    return (
      <React.Fragment>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
            <div
                className="mt-2 mb-0"
              style={{
                textAlign: "center",
                // marginBottom: "20px",
                fontSize: "1.5rem",
                lineHeight: "1.2 !important",
                fontWeight: "700",
              }}
            >
              Subscription Plan
            </div>

            {/* <div
              className="text-center"
              style={{ fontSize: "0.9rem", fontWeight: "600" }}
            >
              Awesome Bundles. Cancel anytime.
            </div> */}
            <div className="mt-4">
              {this.state.plans3 &&
                this.state.plans3.map((plan, index) => {
                  return (
                    <PackageCard
                      packageDetails={plan}
                      key={plan.title}
                      index={index}
                    //   onPlanSelection={this.props.onPlanSelection}
                    />
                    
                  );
                })}
              {this.state.plans2 &&
                this.state.plans2.map((plan, index) => {
                  return (
                    <PackageCard
                      packageDetails={plan}
                      key={plan.title}
                      index={index}
                    //   onPlanSelection={this.props.onPlanSelection}
                    />
                  );
                })}
              {/* {this.state.isJazzEnabled === false && 
                (this.state.telcoName !== "mobilink" || this.state.telcoName !== "jazz" || this.state.telcoName !== "warid") ? 
                <TelcoPackageCard onClick={this.handleClick} /> : ""} */}
                {this.state.isJazzEnabled === false && this.state.telcoName === "mobilink" ? ""
                : this.state.isJazzEnabled === false && this.state.telcoName === "jazz" ? "" : 
                this.state.isJazzEnabled === false && this.state.telcoName === "warid" ? "" :
                <TelcoPackageCard onClick={this.handleClick} /> }
              {!this.state.fromInvite ? (
                <div
                  className={`mt-2 mb-4 pl-2 pr-2 pb-4 pt-2 `}
                //   id={`${packageCardStyles.bundleBox}`}
                  style={{
                    cursor: `pointer`,
                    // border: `${
                    //   this.state.expanded ? `1.5px solid #cf3737` : `none`
                    // } `,
                  }}
                  onClick={() => {
                    if (!this.state.expanded)
                      this.setState({
                        expanded: !this.state.expanded,
                      });
                      this.callGoogleEvent("cw-subscription-telcoCardExpand-clicked")
                  }}
                >
                  <div
                    className="d-flex justify-content-between align-items-center w-100"
                    // onClick={() => {
                    //   // if (!this.state.expanded)
                    //   this.setState({
                    //     expanded: !this.state.expanded,
                    //   });
                    // }}
                  >
                    <div className="w-100">
                      <div className=" redCl">
                        <span
                          className={`${packageCardStyles.packageDuration}`}
                          style={{color: "#d32020"}}
                        >{`Check Other bundles`}</span>
                      </div>
                    </div>
                    <div
                      className={`d-flex justify-content-center align-items-center pt-2`}
                    >
                      <span className="">
                        <i
                          className={`fa fa-chevron-${
                            this.state.expanded ? "up" : "down"
                          }`}
                        />
                      </span>
                    </div>
                  </div>
                  <div className={`${this.state.expanded ? "mt-4" : ""}`}>
                    {this.state.expanded &&
                      this.state.plans &&
                      this.state.plans.map((plan, index) => {
                        return (
                          <PackageCard
                            packageDetails={plan}
                            key={plan.title}
                            index={index}
                            // onPlanSelection={this.props.onPlanSelection}
                          />
                          
                        );
                      })}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(SubscriptionPlans);
