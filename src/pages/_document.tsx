import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <div style={{ color: "#333 !important" }}>
          <div
            id="chatbot-widget-website"
            key-id="660f9db725814f00136d3150"
            welcome-text="สวัสดียินดีต้อนรับสู่ Chatbot Platform"
            bot-icon="https://storage.googleapis.com/ai-api/AI%20API%20Image/iapp-avatar.png"
            bot-name="Chochae Chatbot"
            welcome-message="สวัสดีค่ะ มีอะไรสอบถามหรือให้ทางเราช่วยเหลือคะ"
            webhook="https://chochaegpt.iapp.co.th/webhook-website"
          ></div>
          <script src="https://chochaegpt.iapp.co.th/static/script/index.min.js"></script>
          <link
            rel="stylesheet"
            href="https://chochaegpt.iapp.co.th/static/script/index.min.css"
          />
        </div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
