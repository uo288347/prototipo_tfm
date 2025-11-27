import { InitialFormComponent } from "@/components/InitialFormComponent";

export default function InitialForm() {

    return (
        <div style={{flex: 1, minHeight: "100%", padding: "20px 20px", 
            display: "flex", justifyContent: "center", alignItems: "center"}}>
            <InitialFormComponent/>
        </div>
    );
}