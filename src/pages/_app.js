import { Layout, Menu, notification } from 'antd';
import 'antd/dist/reset.css';
import { initNotification } from "../utils/UtilsNotifications";
import { useEffect } from 'react';

let { Header, Content, Footer } = Layout;

export default function App({ Component, pageProps }) {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        initNotification(api);
    }, [api]);

    return (
      <Layout className="layout" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor:"#fff" }}>
          <Content style={{ padding: "0px 0px" }}>
              <Component {...pageProps}/>
          </Content>
          <Footer style={{ textAlign: "center" }}> Teresa González - Universidad de Oviedo </Footer>
      </Layout>
  );
}
