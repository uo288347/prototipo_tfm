import LoginFormComponent from "@/components/LoginFormComponent";

export default function LoginPage({}) {

  return (
    <div style={{flex: 1, minHeight: "100%", padding: "20px 20px", 
      display: "flex", justifyContent: "center", alignItems: "center"}}>
      <LoginFormComponent />
    </div>
  );
}