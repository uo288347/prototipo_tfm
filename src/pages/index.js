import { useRouter } from "next/router";
import { Button } from "antd";

export default function Index() {
  const router = useRouter();
  const handleStart = () => {
    router.push("/form"); 
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
    <Button style={{width:"100%"}} size="large" type="primary" onClick={handleStart}>
      Start
    </Button>
    </div>
  );
}
