import React,{useEffect, useState} from "react";
import { Globals } from "../constants";
import axios from "axios";
import { useHistory } from 'react-router'

function TelcoPay(){
    const history = useHistory()
    const [logo, setLogo] = useState()
    const [pricePoint, setPricePoint] = useState(JSON.parse(localStorage.getItem("price_points")))
    const [loading, setLoading] = useState(false)


    function logoCheck( logo = localStorage.getItem("telco_name")) {
        if(logo == "mobilink"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/jazz_logo.png")
        } else if(logo == "warid"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/jazz_logo.png")
        } else if(logo == "jazz"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/jazz_logo.png")
        } else if (logo == "ufone"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/ufone_logo.png")
        } else if (logo == "zong"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/zong_logo.png")
        } else if (logo == "telenor"){
            return setLogo("https://asset.cricvids.co/cricwick-assets/images/telcos/telenor_logo.png")
        }
    }

    useEffect(() => {
        logoCheck()
    })

    function callGoogleEvent(eventName) {
        window.gtag("event", eventName);
    }

    const sendPin = async (sub_type,packageName) => {
        callGoogleEvent(`MWEB_PBM_PKGSCRN_PKG_${packageName.toUpperCase()}`)
        const url =
            Globals.NodeApi + "api/send_pin?telco=" + localStorage.getItem("telco_name") + "&phone=" + localStorage.getItem("phoneNumber") + "&sub_type="+ sub_type + "&source=2&app_name=CricwickWeb";

        try {
            let response = await axios.get(url);
            console.log("response",response.data.remote_response.status )
            if(response.data.remote_response.status === 1){
                localStorage.setItem("payByMobile", "payByMobile")
                localStorage.setItem("payByMobilePackageName", packageName)
                return history.push("./verifypin")
            }
           
        } catch (err) {
            console.log(err);
            // setData({
            //     ...data,
            //     errMessage: 
            // })
        }
    }

    return(
        <React.Fragment>
            <div style={{paddingLeft: "15px", paddingRight: "15px"}}>
            <div className="text-center">
                <p className="text-subcribe-carrier mb-2 mt-3 ">Subscribe with your carrier</p>
                <img src={logo} width="25%" />
            </div>
            <div className="text-center">
                <p className="text-subscription-plan-zong">Subscription plans</p>
            </div>
            {pricePoint.map((price, index) => {
                console.log("response",price.sub_type)
            return(
                <div className="d-flex justify-content-between zong-subscription-box" key={index} onClick={() => sendPin(price.sub_type, price.price.split(" ")[2])}>
                    <div className="" style={{lineHeight: "2"}}><span className="zong-packages-name"> {price.price.split(" ")[2]}</span></div>
                    <div className="">
                        <p className="mb-0 mt-1" style={{fontSize: "12px", fontWeight: "500"}}>{price.price.split(" ")[0]} <span className="zong-packages-name">{price.price.split(" ")[1]}</span>
                        <span className="ml-2">
                                            {/* <i class="fa fa-angle-right" aria-hidden="true"></i> */}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="7.05" height="12" viewBox="0 0 7.05 12">
                                                <path id="Shape" d="M11.55,6,6.6,1.05,7.65,0l6,6-6,6L6.6,10.95,11.55,6Z" transform="translate(-6.6)" fill="#5b5b5b"/>
                                            </svg>
                                        </span>
                        </p>
                        {/* <p className="mb-0" style={{    fontSize: "12px", color: "#d1dcdd", textAlign: "end"}}>{`+Tax`}</p> */}
                    </div>
                </div>
            )})}
            </div>
        </React.Fragment>
    )
}

export default TelcoPay;