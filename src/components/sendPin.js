import React, { useEffect, useState } from "react";
import packageCardStyles from "./packageCard.module.css";
import { Globals } from "../constants";
import axios from "axios";
import { useHistory } from 'react-router';
import InputMask from "react-input-mask";
import PayByOption from "./payByOption";
import {
    Modal,
    ModalBody
} from "reactstrap";

function SendPin(props) {
    const history = useHistory()
    const [packageDetails, setPackageDetails] = useState(JSON.parse(localStorage.getItem("packageDetails")));
    const [packageID, setPackageID] = useState(localStorage.getItem("packageID"));
    const [jazzCash, setJazzCash] = useState(localStorage.getItem("jazzCashTitle"));
    const [phone, setPhone] = useState(localStorage.getItem("phoneNumber"))
    const [cnicForJazzCash, setCnicForJazzCash] = useState("")
    const [btnDisbaled, setBtnDisbaled] = useState(false)
    const [errMessage, setErrMessage] = useState("")
    const [payWithCard, setPayWithCard] = useState(true)
    const [btnTxt, setBtnTxt] = useState("Pay Now")
    const [easyPaisamodal, setEasyPaisamodal] = useState(false)

    function callGoogleEvent(eventName) {
        window.gtag("event", eventName);
    }

    const pinChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setPhone(e.target.value);
        }
    };

    const cnicForJazzCashChange = (e) => {
        setCnicForJazzCash(e.target.value);
    };

    function subscribeEasyPaisatoggle() {
        setEasyPaisamodal(!easyPaisamodal)
        history.push(`./subscription/${phone}/${"cricwick"}`)
    }

    const easyPaisaNotFirstTimeUser = async (e) => {
        e.preventDefault();
        // packageDetails.interval_type
        callGoogleEvent(`MWEB_PBUNDLE_POPUP_PROC`)
        const url =
            Globals.NodeApi + "api/send_pin?telco=easypaisa&phone=" + phone + "&sub_type=1&source=2&is_bundle=1&app_name=CricwickWeb&bundle_id=" + 5;

        try {
            let response = await axios.get(url);
            console.log("response", response)

            if (response.data.status == 1) {
                localStorage.setItem("phoneNumber", phone)
                localStorage.setItem("telco_name", "easypaisa")
                localStorage.setItem("firstTimeUser", true)
                history.push(`/verifypin`)
            }

        } catch (err) {
            console.log(err);
            // setData({
            //     ...data,
            //     errMessage: 
            // })
        }
    }

    const sendTelcoPin = async (e) => {
        e.preventDefault();
        // packageDetails.interval_type
        callGoogleEvent(`MWEB_${packageDetails.interval_type.toUpperCase()}EP_ADD.VNUM_SPIN`)
        if(packageDetails.id !== 13){
            callGoogleEvent(`MWEB_${packageDetails.interval_type.toUpperCase()}EP_ADD.VNUM_SPIN`)
        } else {
            callGoogleEvent(`MWEB_PBUNDLE_EP_ADD.VNUM_SPIN`)
        }
        
        if (phone.length < 11) {
            setErrMessage("Invalid Phone number")
            return;
        }
        setBtnDisbaled(true)
        const url =
            Globals.NodeApi + "api/send_pin?telco=easypaisa&phone=" + phone + "&sub_type=1&source=2&is_bundle=1&app_name=CricwickWeb&bundle_id=" + packageDetails.id;

        try {
            let response = await axios.get(url);
            console.log("response", response)
            if (response.data.error === "Invalid Phone number") {
                setErrMessage(response.data.error)
                setBtnDisbaled(false)
            }
            if(response.data.remote_response.purchased_ep_ever === true){
                setEasyPaisamodal(true)
                return false
            }
            if (response.data.status == 1) {
                setBtnDisbaled(false)
                localStorage.setItem("phoneNumber", phone)
                localStorage.setItem("telco_name", "easypaisa")
                history.push(`/verifypin`)
            }

        } catch (err) {
            console.log(err);
            // setData({
            //     ...data,
            //     errMessage: 
            // })
        }
    }

    const payWithJazzCard = async (e) => {
        e.preventDefault();

        callGoogleEvent(`MWEB_${packageDetails.interval_type.toUpperCase()}JCASH_PBC_PNOW`)
        if (phone.length < 11) {
            setErrMessage("Invalid Phone number")
            return;
        }
        setBtnDisbaled(true)
        let url = `${Globals.NodeApi}api/card_payment?telco=card_payment&phone=${phone
            }&bundle_id=${packageDetails.id}&source=2&sub_source=1&app_name=${"CricwickWeb"}`;

        let serverResponse;
        try {
            serverResponse = await axios.get(url, {});
            console.log("Server response for card", serverResponse);
            serverResponse = serverResponse.data;

            if (serverResponse.status === 0) {
                setBtnTxt("Pay Now")
                setBtnDisbaled(false)
                serverResponse.status_message
                    ? setErrMessage(serverResponse.status_message)
                    : setErrMessage(serverResponse.message)
                return;
            }
            if (serverResponse.remote_response.status === 0) {
                setBtnTxt("Pay Now")
                setBtnDisbaled(false)
                serverResponse.remote_response.status_message
                    ? setErrMessage(serverResponse.remote_response.status_message)
                    : setErrMessage(serverResponse.remote_response.message)
                return;
            }

            if (
                serverResponse &&
                serverResponse.status === 1 &&
                serverResponse.remote_response &&
                serverResponse.remote_response.status === 1 &&
                serverResponse.remote_response.user &&
                serverResponse.remote_response.redirect_url &&
                serverResponse.remote_response.redirect_url.length > 0
            ) {
                window.open(serverResponse.remote_response.redirect_url, "_self");
            } else {
                localStorage.setItem("token", serverResponse.remote_response.user.x_access_token)
                history.push(`/welcome`)
            }
        } catch (error) {
            console.log(`serverResponse,`, serverResponse);
            setBtnDisbaled(false)
            setErrMessage("Something went wrong")
        }
    };

    const sendJazzCashPin = async (e) => {
        e.preventDefault();
        callGoogleEvent(`MWEB_LINK_SUBSCRN_JC_${packageDetails.interval_type.toUpperCase()}`)
        if (phone.length < 11) {
            setErrMessage("Invalid Phone number")
            return;
        }
        setBtnDisbaled(true)
        let url = `${Globals.NodeApi}api/one_time_payment?telco=jazzcash&phone=${phone
            }&bundle_id=${packageDetails.id}&source=2&sub_source=1&app_name=CricwickWeb&last_six_cnic=${cnicForJazzCash.replace(/-/g, "").slice(-6)}`;

        try {
            let response = await axios.get(url);
            console.log("response", response)
            if (response.data.error === "Invalid Phone number") {
                setErrMessage(response.data.error)
                setBtnDisbaled(false)
            }
            if (response.data.remote_response.status == 0) {
                setBtnDisbaled(false)
                localStorage.setItem("phoneNumber", phone)
                localStorage.setItem("telco_name", "jazzcash")
                setErrMessage(response.data.remote_response.status_message)
            }
            if (response.data.remote_response.status == 1) {
                setBtnDisbaled(false)
                localStorage.setItem("phoneNumber", phone)
                localStorage.setItem("telco_name", "jazzcash")
                history.push(`/success`)
            }

        } catch (err) {
            console.log(err);

        }
    }
    console.log("jazzCash", jazzCash, packageDetails.interval_type)

    return (
        <React.Fragment>
            <div>
                <Modal isOpen={easyPaisamodal} toggle={subscribeEasyPaisatoggle} className={props.className} backdrop="false">
                    <ModalBody>
                        <div className="text-center" style={{ padding: "30px" }}>
                            <img src="https://asset.cricvids.co/cricwick-assets/images/cricwick/cricwick-logo.jpg?v=3" width="50%" />
                        </div>
                        <div className="text-center">
                            <p style={{ fontSize: "15px", fontWeight: "600", lineHeight: "1.6", marginBottom: "5px" }}>You are not 1st Time easypaisa user. <br /> You will be charged</p>
                            <p style={{ color: "#c33029", fontSize: "30px", fontWeight: "700", marginBottom: "-5px" }}>Rs.20</p>
                            <p style={{ fontSize: "13px" }}>for a week</p>
                        </div>
                        <div>
                            <button
                                className="submit btn-cursor-pointer"
                                style={{ width: "330px !important" }}
                              onClick={easyPaisaNotFirstTimeUser}
                            // disabled={this.state.btnDisbaled}
                            >
                                {`Proceed`}
                            </button>
                        </div>
                        <div style={{ marginTop: "35px", textAlign: "center", paddingBottom: "20px", }}>
                            <p style={{ marginBottom: "0px", fontSize: "17px" }}>Don't want weekly subscription?</p>
                            <p style={{ textDecoration: "underline", color: "#c33029", fontSize: "18px", cursor: "pointer" }}
                                onClick={
                                    // this.setState({
                                    //   showNewSubscriptionFlow: true,
                                    //   showInputFlow: false,
                                    //   plan: null,
                                    //   paymentGateway: -1,
                                    //   gPayFlow: false,
                                    // }),
                                    subscribeEasyPaisatoggle
                                }
                            >
                                Check Other Bundles
                            </p>
                        </div>
                    </ModalBody>
                </Modal>
            </div>
            <div style={{ paddingLeft: "15px", paddingRight: "15px" }}>
                <div className="">
                    <p className="mt-4" style={{ textAlign: "center", fontSize: "20px", textTransform: "uppercase", fontWeight: "700" }}>Add phone Number</p>
                    {/* <p className="" style={{ textAlign: "center", fontSize: "14px", fontWeight: "600" }}>Awesome Bundle. Cancel anytime</p> */}
                </div>
                <div style={{ borderRadius: "6px", padding: "8px 10px 0px 10px", border: "1px solid #d32020" }}>
                    <div className="d-flex justify-content-between" >
                        <div className="d-flex flex-column justify-content-start align-items-start">
                            <h6 className="" style={{ fontSize: "12px", fontWeight: "600", color: "#d32020" }}>Your Bundle</h6>
                            <h6 className="" style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase" }}>{packageDetails.title}</h6>
                            <p className="" style={{ fontSize: "11px", fontWeight: "600" }}>{jazzCash === "JazzCash" ? packageDetails.description : ""}</p>
                        </div>
                        <div className="d-flex flex-column justify-content-start align-items-end">
                            {packageDetails.description.includes("Only for new users.") ?
                                [packageDetails.description ? (
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
                                                >{`${"Pkr"}`}</span>
                                            </div>
                                            <div>
                                                <span
                                                    className={`${packageCardStyles.actualAmount}`}
                                                >{`${packageDetails.actual_amount
                                                    }`}</span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null]
                                : ""}

                            <div className={`d-flex align-items-center justify-content-end`}>
                                <div className="">
                                    <span className="" style={{ fontSize: "11px", fontWeight: "600", textTransform: "uppercase" }}>Pkr</span>
                                </div>
                                <div className="pl-2">
                                    <span className="" style={{ fontSize: "22px", fontWeight: "700" }}>{packageDetails.amount}</span>
                                </div>
                            </div>
                            <div>
                                <span className="" style={{ fontSize: "11px", color: "rgb(206, 206, 206)" }}>{`Inclusive of taxes`}</span>
                            </div>
                        </div>

                    </div>

                    {packageDetails.description.includes("Only for new users.") ?
                        [packageDetails.description ? (
                            <div className="mt-2 d-flex justify-content-start mb-2" style={{ padding: "5px", background: "#e5c8c8", color: "#d32020", borderRadius: "4px" }}>
                                <span style={{ marginTop: "5px", marginRight: "5px" }}>
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
                                <p className="mb-0" style={{ fontSize: "10px" }}>
                                    {packageDetails.description}
                                </p>
                            </div>
                        ) : null]
                        : ""}
                </div>
                {packageDetails.payment_gateways.map((icon, i) => {
                    if (icon.id == packageID) {
                        return (
                            <div className="text-center mt-4">
                                <img src={icon.icon_url} width="25%" />
                            </div>
                        )
                    }
                })}
                {jazzCash === "JazzCash" ? (
                    <div className={`mt-3 d-flex flex-column flex-md-row justify-content-center align-items-center`}>
                        <PayByOption
                            option={{ title: "Card" }}
                            selected={payWithCard}
                            onCardClick={() => {
                                setPayWithCard(true)
                            }}
                        />
                        <PayByOption
                            option={{ title: "Wallet" }}
                            selected={!payWithCard}
                            onCardClick={() => {
                                setPayWithCard(false)
                            }}
                            parentClasses={"mr-2"}
                        />
                    </div>
                ) : null}
                <div>
                    {jazzCash === "JazzCash" &&
                        !payWithCard ? (
                        <div>
                            <div
                                className="mb-1"
                                style={{ fontSize: "1.3rem", fontWeight: "600", textAlign: "center" }}
                            >
                                {`Enter Your CNIC`}
                            </div>
                            <InputMask
                                className="payout-input-cnic"
                                mask="99999-9999999-9"
                                value={cnicForJazzCash}
                                name="cnicForJazzCash"
                                id="cnicForJazzCash"
                                placeholder="xxxxx-xxxxxxx-x"
                                // onChange={this.loginValuesChange}
                                onChange={cnicForJazzCashChange}
                            />
                        </div>
                    ) : null}

                </div>
                <div className="text-center mt-4">
                    <p style={{ marginBottom: "0", fontWeight: "700" }}>Your Number</p>
                    <p className="mb-1" style={{ fontSize: "13px", fontWeight: "600" }}>Please use {jazzCash === "JazzCash" ? "jazzcash" : "easypaisa"} registered number only</p>
                    <input
                        // name={pin}
                        type="text"
                        // ref={this.textInput}
                        placeholder="03 xx xxxxxxx"
                        value={phone}
                        onChange={pinChange}
                        // onKeyPress={this.handleKeypress}
                        autoComplete="off"
                        className="telco-input"
                        maxLength="11"
                    />
                    <p style={{ color: "red" }}>{errMessage}</p>
                    {payWithCard === true ?
                        <button
                            className="submit btn-cursor-pointer" style={{ height: "52px" }}
                            onClick={jazzCash === "EasyPaisa" ? sendTelcoPin : payWithJazzCard}
                            disabled={btnDisbaled}
                        >
                            {btnTxt}
                        </button> :
                        <button
                            className="submit btn-cursor-pointer" style={{ height: "52px" }}
                            onClick={sendJazzCashPin}
                            disabled={btnDisbaled}
                        >
                            Send Pin
                        </button>
                    }
                    {/* <p className="verification-text mt-4" style={{ fontSize: "17px", fontWeight: "500", textDecoration: "underline" }}>Terms & Condition</p> */}
                </div>
            </div>
        </React.Fragment>
    )
}

export default SendPin;