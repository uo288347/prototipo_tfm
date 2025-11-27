import { useRouter } from "next/router";
import { Button } from "antd";

export default function Index() {
  const router = useRouter();
  const handleStart = () => {
    router.push("/form"); 
  };

  return (
    <div style={{flex: 1, minHeight: "100%", padding: "20px 20px", 
      display: "flex", justifyContent: "center", alignItems: "center"}}>
    <Button style={{width:"100%"}} size="large" type="primary" onClick={handleStart}>
      Start
    </Button>
    </div>
  );
}
