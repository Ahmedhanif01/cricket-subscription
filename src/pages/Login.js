import React, { useState } from "react";
import { Globals } from "../constants";
import axios from "axios";
import { useHistory } from 'react-router'
import Loading from "../components/Loading";
import cover from "../assets/New Fantasy banner – 1 (1).png"

function Login() {
    const history = useHistory()
    const [data, setData] = useState({
        heading: "Enter phone number",
        inputName: "phone",
        phonePlaceholder: "03 xx xxxxxxx",
        phone: "",
        btnTxt: "Proceed",
        telco_name: "",
        phoneNumber: "",
        errMessage: "",
        isvalid: false,
    })
    const [isPintSet, setIsPinSet] = useState(null)
    const [isSubscribed, setIsSubscibed] = useState(null)
    const [btnDisbaled, setBtnDisbaled] = useState(false)
    const [loading, setLoading] = useState(false)

    const loginValuesChange = (e) => {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setData({ ...data, [e.target.name]: e.target.value });
         }
    };

    const login = async (e) => {
        e.preventDefault();

        if (data.phone === "") {
            setData({
                ...data,
                errMessage: "Please Enter Phone Number",
            })
            return;
          }
          if (data.phone.length < 11) {
            setData({
                ...data,
                errMessage: "Invalid Phone number",
            })
            return;
          }
        setLoading(true)
        setBtnDisbaled(true)
        const url =
            Globals.NodeApi + "api/find_sub_tel_phone?phone=" + data.phone + "&source=2&app_name=CricwickWeb";

        try {
            let response = await axios.get(url);
            if (response.data.error === "Invalid Phone number") {
                setData({
                    ...data,
                    errMessage: response.data.error,
                })
                setBtnDisbaled(false)
            }

            setIsPinSet(response.data.remote_response.is_pin_sent)
            setIsSubscibed(response.data.remote_response.is_subscribed)
            if (response.data.remote_response.is_pin_sent === true && response.data.remote_response.is_subscribed === true) {
                setData({
                    ...data,
                    phone: "",
                })
                setBtnDisbaled(false)
                history.push(`/verifypin`)
                localStorage.setItem("phoneNumber", response.data.remote_response.user.phone)
                localStorage.setItem("telco_name", response.data.remote_response.telco_name)
                localStorage.setItem("bundle_id", response.data.remote_response.user.bundle_id)
                
            } else if (response.data.remote_response.is_pin_sent === false && response.data.remote_response.is_subscribed === false) {
                setBtnDisbaled(false)
                setLoading(false)
                history.push(`./subscription-plan/${data.phone}`)
                localStorage.setItem("telco_name", response.data.remote_response.telco_name)
                localStorage.setItem("phoneNumber", data.phone)
                localStorage.setItem("price_points", JSON.stringify(response.data.remote_response.price_points))
                localStorage.setItem("bundle_id", response.data.remote_response.user.bundle_id)
            }

        } catch (err) {
            console.log(err);
            // setData({
            //     ...data,
            //     errMessage: 
            // })
        }
    }


    return (
        <React.Fragment>
            {loading === true ? (
                <Loading/>
            ) : ( 
            <>
            <div>
                <img src={cover} alt="" width="100%"/>
            </div>
            <div className="mt-4" style={{ textAlign: "center", width: "87%", margin: "auto" }}>
                <h2 className="subscription-heading mb-3">{data.heading}</h2>
                <input
                    name={data.inputName}
                    type="text"
                    // ref={this.textInput}
                    placeholder={data.phonePlaceholder}
                    value={data.phone}
                    onChange={loginValuesChange}
                    // onKeyPress={this.handleKeypress}
                    autoComplete="off"
                    className="telco-input"
                    maxLength="11"
                />
                <p style={{ color: "red" }}>{data.errMessage}</p>
                <button
                    className="submit btn-cursor-pointer"
                    style={loading === false ? {background: "linear-gradient(270deg, #c12026 36.03%, #ed2e04 81.99%)"} : {background: "gray"}}
                    onClick={login}
                    disabled={btnDisbaled}
                >
                    {data.btnTxt}
                </button>
            </div>
            </>
            )} 
        </React.Fragment>
    )
}

export default Login;