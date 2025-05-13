import React, { useState } from "react";

import "../styles/alert.css";

interface AlertMessageProps {
    message: string;
    type: "home" | "play" | "panel";
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, type }) => {
    const [visible, setVisible] = useState(true);
    const className =
        type === "home"
            ? "alertHome"
            : type === "play"
                ? "alertPlay"
                : "alertPanel";

    if (!visible) return null;

    return (
        <div className={`alertBase ${className}`}>
            <span>{message}</span>
            <button onClick={() => setVisible(false)}>✖</button>
        </div>
    );
};

export default AlertMessage;
// alert.css