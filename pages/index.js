const { ChatAppConnect } = require("../Context/ChatAppContext");
const { useContext } = require("react");

const ChatApp = () => {
  const {} = useContext(ChatAppConnect);

  return <div>hey</div>;
};

export default ChatApp;
