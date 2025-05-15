import React, { useState } from "react";

import "../styles/alert.css";

interface AlertMessageProps {
    message: string;
    type: "home" | "play" | "panel";
    onClose: VoidFunction
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type, onClose }) => {
    const className =
        type === "home"
            ? "alertHome"
            : type === "play"
                ? "alertPlay"
                : "alertPanel";

    if (message == "") return null;

    return (
        <div className={`alertBase ${className}`}>
            <span>{message}</span>
            <button onClick={() => {
                onClose();
            }}>
                ✖
            </button>
        </div>
    );
};

export default AlertMessage;
// alert.css