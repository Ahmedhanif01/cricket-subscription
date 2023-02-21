import React, { useState } from "react";


function WelcomeSubscribe() {
    const [payByMobile, setPayByMobile] = useState(localStorage.getItem("payByMobile"))
    const [payByMobilePackageName, setPayByMobilePackageName] = useState(localStorage.getItem("payByMobilePackageName"))
    const [jazzCash, setJazzCash] = useState(localStorage.getItem("jazzCashTitle"));
    const [packageDetails, setPackageDetails] = useState(JSON.parse(localStorage.getItem("packageDetails")));
    
    function callGoogleEvent(eventName) {
        window.gtag("event", eventName);
    }

    const openCricwick = () => {
        if(payByMobile !== "payByMobile"){
            if(jazzCash ==="EasyPaisa"){
                if(packageDetails.id !== 13){
                    this.callGoogleEvent(`MWEB_${packageDetails.interval_type}EP_PINVER_SUB_OPENCW`)
                } else {
                    this.callGoogleEvent(`MWEB_PBUNDLE_PINVER_SUB_OPENCW`)
                }
            } else {
                this.callGoogleEvent(`MWEB_${packageDetails.interval_type}JC_PINVER_SUB_OPENCW`)
            }
        } else {
            callGoogleEvent(`MWEB_PBM_PKG_${payByMobilePackageName.toUpperCase()}_VPIN_SUB_OPENCW`)
        }
        let xAccessToken = localStorage.getItem("token");

        if (xAccessToken && xAccessToken.length > 0) {
            let link = "http://cricwick.net/welcome/" + xAccessToken;
            window.open(link, "_self");
        }
    }

    return (
        <React.Fragment>
            <div className="weclome-subscribe-page">
                <div className="mt-5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
                        <g id="Group_46454" data-name="Group 46454" transform="translate(-170 -231)">
                            <circle id="Ellipse_1184" data-name="Ellipse 1184" cx="40" cy="40" r="40" transform="translate(170 231)" fill="#0ebc93" opacity="0.2" />
                            <circle id="Ellipse_1185" data-name="Ellipse 1185" cx="29" cy="29" r="29" transform="translate(181 242)" fill="#0ebc93" opacity="0.2" />
                            <circle id="Ellipse_1186" data-name="Ellipse 1186" cx="20" cy="20" r="20" transform="translate(190 251)" fill="#0ebc93" />
                            <path id="Path_103151" data-name="Path 103151" d="M16314.186,8426.748l5.939,5.938,11.072-11.073" transform="translate(-16112.69 -8156.149)" fill="none" stroke="#fff" stroke-linecap="round" stroke-width="3" />
                        </g>
                    </svg>
                </div>
                <h3 className="mt-5 mb-2" style={{color: "#7cbd7c", textTransform: "uppercase", fontSize: "17px"}}>Ap Subscribe ho gae hain</h3>
                <p>Niche diye gae button pe click kar k <br /> cricwick app open karein</p>
                
                    <button
                        className="submit btn-cursor-pointer mb-3" style={{ height: "52px" }} onClick={() => openCricwick()}
                    >
                        Open Cricwick app
                    </button>
                
            </div>
        </React.Fragment>
    )
}

export default WelcomeSubscribe;