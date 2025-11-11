import { Button } from "antd-mobile";

export const SelectionIndicator = ({selectionMode, nSelectedItems, cancelSelection}) => {
    return (
        <>
        {selectionMode && (
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            backgroundColor: "#eff6ff",
                            borderRadius: "0.5rem",
                            padding: "0.5rem 0.75rem",
                        }}>
                            <span style={{
                                fontSize: "0.875rem",
                                color: "#1e3a8a"
                            }}>
                                {nSelectedItems} selected product(s)
                            </span>
                            <Button size="small" onClick={cancelSelection}>
                                Cancel
                            </Button>
                        </div>
                    )}
                    </>
    );
}