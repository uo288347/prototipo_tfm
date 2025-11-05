import { InitialFormComponent } from "./components/InitialFormComponent";

export default function InitialForm() {

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "20px 20px"}}>
            <InitialFormComponent/>
        </div>
    );
}