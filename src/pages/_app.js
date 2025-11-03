import { Layout, Menu } from 'antd';
import 'antd/dist/reset.css';

let { Header, Content, Footer } = Layout;

export default function App({ Component, pageProps }) {
  return (
      <Layout className="layout">
          <Content>
              <Component {...pageProps} />
          </Content>
          <Footer> Wallapep </Footer>
      </Layout>

  );
}
