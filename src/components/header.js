import React from "react";
import { Link} from "react-router-dom"

function header(){

    return(
        <Link to="/">
        <div className="header-logo-bg">
            <img style={{width: "120px"}} src="https://asset.cricvids.co/cricwick-assets/images/cricwick/cricwick-logo.jpg?v=3" alt=""/>
        </div>
        </Link>
    )
}

export default header;
