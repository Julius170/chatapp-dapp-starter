import "@/styles/globals.css";
import { ChatAppProvider } from "../Context/ChatAppContext";
import { NavBar } from "../Components/index";

export default function App({ Component, pageProps }) {
  return (
    <ChatAppProvider>
      <NavBar /> 
      <Component {...pageProps} />
    </ChatAppProvider>
  );
}
