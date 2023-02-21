import React, { Component } from "react";
import packageCardStyles from "./packageCard.module.css";
import { withRouter } from "react-router";

class PackageCard extends Component {
    constructor(props) {
        super(props);
        this.sendPinValue = this.sendPinValue.bind(this);
        this.callGoogleEvent = this.callGoogleEvent.bind(this);
        this.state = {
            expanded: false,
        };
    }


    returnSubscriptionIncludes = (features) => {
        return (
            <div>
                <div
                    className="d-flex justify-content-start w-100"
                    style={{
                        marginTop: `10px`,
                    }}
                >
                    <span
                        className={`${packageCardStyles.subhead}`}
                    >{`Subscription Includes:`}</span>
                </div>{" "}
                <div>
                    {features.map((feature) => {
                        return (
                            <div className={`d-flex mt-2`} key={feature.title}>
                                <div
                                    className={`d-flex justify-content-center align-items-center`}
                                >
                                    {feature.icon_url ? (
                                        <img
                                            src={`${feature.icon_url}`}
                                            alt=""
                                            width={25}
                                            height={25}
                                        />
                                    ) : null}
                                </div>
                                <div className="d-flex justify-content-start align-items-center ml-3">
                                    <span>{`${feature.title ? feature.title : ``}`}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    callGoogleEvent(eventName) {
        window.gtag("event", eventName);
    }

    sendPinValue = (packageDetails, id, jazzCash) => {
        console.log("package", id, packageDetails.id, jazzCash)
        if(jazzCash ==="EasyPaisa" && packageDetails.id !== 13){
            this.callGoogleEvent(`MWEB_LINK_SUBSCRN_EP_${packageDetails.interval_type}`)
            console.log(`MWEB_LINK_SUBSCRN_EP_${packageDetails.interval_type}`)
        } else {
            this.callGoogleEvent(`MWEB_LINK_SUBSCRN_JC_${packageDetails.interval_type}`)
        }
        if(packageDetails.id === 13){
            this.callGoogleEvent(`MWEB_LINK_SUBSCRN_PBUNDLE_EP`)
            console.log("MWEB_LINK_SUBSCRN_PBUNDLE_EP")
        }
        localStorage.setItem("packageDetails", JSON.stringify(packageDetails))
        localStorage.setItem("packageID", id)
        localStorage.setItem("jazzCashTitle", jazzCash)
        // if(this.props.match.params.phoneNumber !== undefined){
        //     localStorage.setItem("phoneNumber", this.props.match.params.phoneNumber)
        //     localStorage.setItem("appName", this.props.match.params.appName)
        // }
        return this.props.history.push("/sendpin")
    }

    returnPayWith = (paymentGatways) => {
        return (
            <div>
                <div
                    className="d-flex justify-content-start w-100"
                    style={{
                        marginTop: `10px`,
                    }}
                >
                    <span style={{ fontSize: "12px" }} className={`${packageCardStyles.subhead}`}>{`Pay With:`}</span>
                </div>{" "}
                <div>
                    {paymentGatways.map((paymentGatway, index) => {
                        return (
                            [paymentGatway.title !== "GPay" &&
                                <div
                                    className={`d-flex justify-content-between `}
                                    key={paymentGatway.title}
                                    style={{
                                        cursor: `pointer`,
                                        marginTop: index !== 0 ? `23px` : `12px`,
                                    }}
                                    // onClick={() => {
                                    //   if (this.props.onPlanSelection)
                                    //     this.props.onPlanSelection(
                                    //       this.props.packageDetails,
                                    //       index
                                    //     );
                                    // }}
                                    onClick={() => this.sendPinValue(this.props.packageDetails, paymentGatway.id, paymentGatway.title)}
                                >
                                    <div
                                        className={`d-flex justify-content-start align-items-center`}
                                    >
                                        {paymentGatway.icon_url ? (
                                            <img
                                                src={`${paymentGatway.icon_url}`}
                                                alt=""
                                                width={`50%`}
                                                height={`auto`}
                                            />
                                        ) : null}
                                    </div>
                                    <div
                                        className={`d-flex justify-content-center align-items-center`}
                                    >
                                        <span className="">
                                            {/* <i class="fa fa-angle-right" aria-hidden="true"></i> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="7.05" height="12" viewBox="0 0 7.05 12">
                                                <path id="Shape" d="M11.55,6,6.6,1.05,7.65,0l6,6-6,6L6.6,10.95,11.55,6Z" transform="translate(-6.6)" fill="#5b5b5b"/>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            ]);
                    })}
                </div>
            </div>
        );
    };

    componentDidMount() {
        if (this.props.packageDetails.is_best)
            this.setState({
                expanded: true,
            });
        else if (this.props.expanded && this.props.expanded !== this.state.expanded)
            this.setState({
                expanded: this.props.expanded,
            });
    }

    componentDidUpdate(prevProps) {
        if (this.props.expanded && this.props.expanded !== prevProps.expanded)
            this.setState({
                expanded: this.props.expanded,
            });
    }

    render() {
        let packageDetails = this.props.packageDetails;
        // console.log("packageDetails", packageDetails)
        console.log("packageDetails", this.props.match.params)
        return (
            <React.Fragment>
                {packageDetails ? (
                    <div
                        className={`mt-2 mb-4 pl-2 pr-2 pb-3 ${!this.state.expanded ? packageCardStyles.bundleBox1 : ``
                            }`}
                        id={`${packageCardStyles.bundleBox}`}
                        onClick={() => {
                            if (!this.state.expanded)
                                this.setState({
                                    expanded: true,
                                });
                        }}
                        style={{
                            cursor: this.state.expanded ? `` : `pointer`,
                            border: `${this.state.expanded ? `1.5px solid #cf3737` : `none`
                                } `,
                        }}
                    >
                        <div
                            className={`d-flex justify-content-between pt-2 ${packageDetails.is_best ? `mt-2` : ``
                                }`}
                            style={{
                                cursor: `pointer`,
                            }}
                            onClick={(e) => {
                                if (this.state.expanded) this.setState({ expanded: false });
                            }}
                        >
                            <div className="d-flex flex-column justify-content-start align-items-start">
                                {packageDetails.is_best ? (
                                    <div className={`d-flex`}>
                                        <div className={`d-flex align-items-center mr-2`}>
                                            <img
                                                className={`${packageCardStyles.bestValue}`}
                                                src="https://asset.cricvids.co/cricwick-assets/images/payout/star.svg"
                                                width={`10px`}
                                                height={`10px`}
                                                alt=""
                                            />
                                        </div>
                                        <div className={`d-flex align-items-center`}>
                                            <span
                                                className={`${packageCardStyles.bestValue}`} style={{ fontSize: "12px" }}
                                            >{`Most Popular`}</span>
                                        </div>
                                    </div>
                                ) : null}
                                <div className="d-flex w-100 mt-1">
                                    <div className="">
                                        <span
                                            className={`${packageCardStyles.packageDuration}`}
                                        >{`${packageDetails.title ? packageDetails.title : ``
                                            }`}</span>
                                    </div>
                                    {packageDetails.save_percentage ? (
                                        <div
                                            className={`${packageCardStyles.chip
                                                } d-flex justify-content-center align-items-center`}
                                        >
                                            <span className="text-center">{`${packageDetails.save_percentage
                                                ? packageDetails.save_percentage
                                                : ``
                                                }`}</span>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="" >
                                    <span
                                        className={`${packageCardStyles.packageDuration}`} style={{fontWeight: "500", fontSize: "12px"}}
                                    >{packageDetails.pp_description}</span>
                                </div>

                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <div>
                                    {packageDetails.actual_amount &&
                                        packageDetails.actual_amount !== packageDetails.amount ? (
                                        <div
                                            className={`d-flex align-items-center justify-content-end`}
                                        >
                                            <div
                                                className={`d-flex align-items-center justify-content-end ${packageCardStyles.actualAmountDiv
                                                    }`}
                                            >
                                                <div className="mr-1">
                                                    <span
                                                        className={`${packageCardStyles.actualAmount}`}
                                                    >{`${packageDetails.region.currency}`}</span>
                                                </div>
                                                <div>
                                                    <span
                                                        className={`${packageCardStyles.actualAmount}`}
                                                    >{`${packageDetails.actual_amount
                                                        ? packageDetails.actual_amount
                                                        : ``
                                                        }`}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}

                                    <div
                                        className={`d-flex align-items-center justify-content-end`}
                                    >
                                        <div className="pt-1 mr-2">
                                            <span
                                                className={`${packageCardStyles.packageCurrency}`}
                                            >{`${packageDetails.region.currency}`}</span>
                                        </div>
                                        <div>
                                            <span className={`${packageCardStyles.pricePoint}`}>{`${packageDetails.amount ? packageDetails.amount : ``
                                                }`}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span
                                            className={`${packageCardStyles.pricePointSubHeading}`}

                                        >{`Inclusive of taxes`}</span>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {this.state.expanded && packageDetails.features.length
                            ? this.returnSubscriptionIncludes(packageDetails.features)
                            : null}

                        {this.state.expanded &&
                            !this.props.dontShowPaymentGateways &&
                            packageDetails.payment_gateways.length ? (
                            <React.Fragment>
                                <div
                                    style={{
                                        borderBottom: `1px solid #d4d4d4`,
                                        // marginTop: `20px`,
                                        // marginBottom: `20px`,
                                    }}
                                />
                                {this.returnPayWith(packageDetails.payment_gateways)}

                                {packageDetails.description.includes("Only for new users.") ?
                                    [packageDetails.description ? (
                                        <div className="mt-4 d-flex justify-content-start" style={{ padding: "1px 18px 0px 4px", background: "#e5c8c8", color: "#d32020", borderRadius: "4px" }}>
                                            <span style={{ marginTop: "5px", marginRight: "5px", padding: "4px" }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15.191" height="16.691" viewBox="0 0 15.191 16.691">
                                                    <g id="Group_46440" data-name="Group 46440" transform="translate(-46.505 -261)">
                                                        <text id="_" data-name="!" transform="translate(52 274)" fill="#b91414" font-size="12" font-family="BarlowCondensed-Black, Barlow" font-weight="800"><tspan x="0" y="0">!</tspan></text>
                                                        <g id="Group_39242" data-name="Group 39242" transform="translate(44.999 259.5)">
                                                            <g id="Group_39241" data-name="Group 39241" transform="translate(0 0)">
                                                                <path id="Path_51272" data-name="Path 51272" d="M36.847,3.188,31.94.358a2.7,2.7,0,0,0-2.687,0l-4.907,2.83A2.7,2.7,0,0,0,23,5.518v5.655a2.7,2.7,0,0,0,1.346,2.33l4.907,2.83a2.7,2.7,0,0,0,2.687,0l4.907-2.83a2.7,2.7,0,0,0,1.346-2.33V5.518A2.7,2.7,0,0,0,36.847,3.188Zm.042,7.985a1.389,1.389,0,0,1-.693,1.2L31.289,15.2a1.389,1.389,0,0,1-1.384,0L25,12.373a1.389,1.389,0,0,1-.693-1.2V5.518A1.389,1.389,0,0,1,25,4.318L29.9,1.488a1.389,1.389,0,0,1,1.384,0L36.2,4.318a1.389,1.389,0,0,1,.693,1.2Z" transform="translate(-21.495 1.5)" fill="#b91414" />
                                                            </g>
                                                        </g>
                                                    </g>
                                                </svg>
                                            </span>
                                            <p className="mb-0" style={{ fontSize: "10px", padding: "6px 2px" }}>
                                                {packageDetails.description}
                                            </p>
                                        </div>
                                    ) : null]
                                    : ""}

                            </React.Fragment>
                        ) : null}
                    </div>
                ) : null}
            </React.Fragment>
        );
    }
}

export default withRouter(PackageCard);
