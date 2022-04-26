import React from "react";
import "./LoadingAction.css"
class LoadingAction extends React.Component {
    render() {
        const {classes, textLoading} = this.props;
        return (
            <div className="loading-action-wrapper">
                <div className="loading-action-content">
                    {textLoading ?? "Đang tải dữ liệu"}
                </div>
            </div>
        );
    }

}

export default LoadingAction;
