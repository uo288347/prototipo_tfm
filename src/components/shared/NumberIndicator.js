import { CheckOutlined } from "@ant-design/icons";

export const NumberIndicator = ({number, status}) => {
    const isCompleted = status === 'finish';
    const isCurrent = status === 'process';
    const isPending = status === 'wait';

    const backgroundColor = isCompleted || isCurrent ? "#1890ff" : "#d9d9d9";
    const color = isCompleted || isCurrent ? "white" : "rgba(0, 0, 0, 0.45)";

    return (
         <div
                style={{
                    width: "2em",
                    height: "2em",
                    zIndex: 10,
                    backgroundColor: backgroundColor,
                    borderRadius: "50%",
                    color: color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "500",
                }}
            >
                {isCompleted ? <CheckOutlined /> : number}
            </div>
    );
}