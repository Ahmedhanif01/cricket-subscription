import React from 'react'

class Loading extends React.Component {
    render() {
        return (
            <div className="main-loader card min-height-80vh">
                <img width="64" height="64" src="https://asset.cricvids.co/cricwick-assets/images/loader_v2.gif" alt="" />
            </div>
        )
    }
}

export default Loading;