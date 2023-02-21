import React, { useEffect, useState } from "react";
import { Globals } from "../constants";
import axios from "axios";
import { useHistory } from 'react-router';
import Loading from "./Loading";
import { CountdownCircleTimer, useCountdown } from 'react-countdown-circle-timer'


function ConfirmPin(props) {
    const history = useHistory()
    const [pin, setPin] = useState("")
    const [sentPinAgain, setSentPinAgain] = useState(false)
    const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem("phoneNumber"))
    const [telcoName, setTelcoName] = useState(localStorage.getItem("telco_name"))
    const [bundleID, setBundleID] = useState(localStorage.getItem("bundle_id"))
    const [errMessage, setErrMessage] = useState("")
    const [packageDetails, setPackageDetails] = useState(JSON.parse(localStorage.getItem("packageDetails")));
    const [payByMobile, setPayByMobile] = useState(localStorage.getItem("payByMobile"))
    const [payByMobilePackageName, setPayByMobilePackageName] = useState(localStorage.getItem("payByMobilePackageName"))
    const [jazzCash, setJazzCash] = useState(localStorage.getItem("jazzCashTitle"));
    const [loading, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(true)
    const [firstTimeUser, setFirstTimeUser] = useState(localStorage.getItem("firstTimeUser"))

    const {
        path,
        pathLength,
        stroke,
        strokeDashoffset,
        remainingTime,
        elapsedTime,
        size,
        strokeWidth,
    } = useCountdown({ isPlaying: isPlaying, duration: 30, colors: 'red' })


    const pinChange = (e) => {
        console.log("e.target.value", e.target.value)
        setPin(e.target.value);
    };

    function callGoogleEvent(eventName) {
        window.gtag("event", eventName);
    }


    const confirmPin = async (e) => {
        e.preventDefault();
        if (payByMobile !== "payByMobile") {
            if (jazzCash === "EasyPaisa") {
                if(packageDetails.id !== 13){
                    callGoogleEvent(`MWEB_${packageDetails?.interval_type}EP_SPIN_OTPSCRN_VPIN`)
                } else {
                    callGoogleEvent(`MWEB_PBUNDLE_SPIN_OTPSCRN_VPIN`)
                }
            } else {
                callGoogleEvent(`MWEB_${packageDetails?.interval_type}JC_SPIN_OTPSCRN_VPIN`)
            }
        } else {
            callGoogleEvent(`MWEB_PBM_PKG_${payByMobilePackageName?.toUpperCase()}_OTPSCRN_VPIN`)
        }

        try {
            // here change the url path on the basis of this.state.gPayFlow
            
            if(jazzCash === "EasyPaisa" || jazzCash === "JazzCash"){
                const bundleID = firstTimeUser == "true" ? 5 : packageDetails.id
                var url = `${Globals.NodeApi}confirmpin?telco=${telcoName}&phone=${phoneNumber}&pin=${pin}&sub_type=${1}&is_bundle=1&bundle_id=${bundleID}&app_name=CricwickWeb`;
            } else {
                var url = `${Globals.NodeApi}confirmpin?telco=${telcoName}&phone=${phoneNumber}&pin=${pin}&sub_type=${1}&app_name=CricwickWeb`;
            }
            
            await axios.get(url, {}).then((response) => {
                console.log("response", response)
                // debugger;
                if (response.data.status === 0) {
                    setErrMessage(response.data.generic_response.message)
                    return
                }
                if (response.data.status === 1) {
                   const res = response.data ? response.data : null;

                    if (res && res.remote_response && res.remote_response.user && res.remote_response.user.x_access_token && res.remote_response.user.x_access_token.length > 0) {
                        localStorage.setItem("token", res.remote_response.user.x_access_token)
                    }

                    history.push(`/success`)
                    console.log("res", res)
                    localStorage.removeItem("jazzCashTitle");
                    localStorage.removeItem("price_points");
                    localStorage.removeItem("phoneNumber");
                    localStorage.removeItem("packageID");
                    localStorage.removeItem("packageDetails");
                    localStorage.removeItem("appName");
                    localStorage.removeItem("telco_name");

                }
            });
        } catch (err) {
            console.log("Error confirming pin", err);
        }
    }

    const sendPinAgain = async (e) => {
        e.preventDefault();
        if (payByMobile !== "payByMobile") {
            if (jazzCash === "EasyPaisa") {
                callGoogleEvent(`MWEB_${packageDetails?.interval_type}EP_SPIN_OTPSCRN_RPIN`)
            } else {
                callGoogleEvent(`MWEB_${packageDetails?.interval_type}JC_SPIN_OTPSCRN_RPIN`)
            }
        } else {
            callGoogleEvent(`MWEB_PBM_PKG_${payByMobilePackageName?.toUpperCase()}_OTPSCRN_RPIN`)
        }
        setErrMessage("")
        setLoading(true)
        const bundleID = firstTimeUser == "true" ? 5 : packageDetails.id
        const url =
            packageDetails !== null ? Globals.NodeApi + `api/send_pin?telco=${telcoName}&phone=${phoneNumber}&sub_type=&sub_source=CricwickWeb&source=2&is_bundle=1&bundle_id=${bundleID}&app_name=Cricwick`
                :
                Globals.NodeApi + `api/send_pin?telco=${telcoName}&phone=${phoneNumber}&sub_type=&sub_source=CricwickWeb&source=2&is_bundle=1&app_name=Crickwick`

        try {
            let response = await axios.get(url);
            setSentPinAgain(false);
            setIsPlaying(true)
            setLoading(false)
            if (response.data.status === 0) {
                setErrMessage(response.data.error)
            }
            // if (response.data.status == 1) {
            //     setBtnDisbaled(false)
            //     localStorage.setItem("phoneNumber", phone)
            //     localStorage.setItem("telco_name", "easypaisa")
            //     history.push(`/verifypin`)
            // }

        } catch (err) {
            console.log(err);
            // setData({
            //     ...data,
            //     errMessage: 
            // })
        }
    }

    const resendPin = () => {
        setTimeout(() => {
            setSentPinAgain(true);
        }, 30000)
    }

    useEffect(() => {
        resendPin()
    }, [sentPinAgain])

    return (
        <React.Fragment>
            {loading === true ? (
                <Loading />
            ) : (
                
                <div className="mt-4" style={{ width: "87%", margin: "auto" }}>
                    <p className="verification-text">Verification code is sent to <br /> <span style={{ fontWeight: 700 }}>{phoneNumber}</span></p>
                    <div className="mb-4 count-down-circle-timer">
                        <CountdownCircleTimer
                            isPlaying
                            duration={30}
                            colors={['red']}
                            size={30}
                            strokeWidth={4}
                        // colorsTime={[7, 5, 2, 0]}
                        >
                            {({ remainingTime }) => remainingTime}
                        </CountdownCircleTimer>

                    </div>
                    <h2 className="cofirm-pin-heading mb-1">Enter OTP received in SMS</h2>
                    <input
                        name={pin}
                        type="text"
                        // ref={this.textInput}
                        placeholder="00000"
                        value={pin}
                        onChange={pinChange}
                        // onKeyPress={this.handleKeypress}
                        autoComplete="off"
                        className="telco-input"
                        maxLength="5"
                    />
                    <p style={{ color: "red", textAlign: "center" }}>{errMessage}</p>
                    <button
                        className="submit btn-cursor-pointer" style={{ height: "48px" }}
                        onClick={confirmPin}
                    // disabled={this.state.btnDisbaled}
                    >
                        Verify Pin
                    </button>
                    <p className="verification-text mt-2">Didn't receive pin?
                        {sentPinAgain === true ?
                            <button className="resend-text ml-2" style={{ outline: "none" }} onClick={sendPinAgain}> Resend Pin</button>
                            :
                            <button className="resend-text ml-2" style={{ color: "gray", outline: "none", cursor: "initial" }}> Resend Pin</button>
                        }
                    </p>
                </div>
            )}
        </React.Fragment>
    )
}

export default ConfirmPin;