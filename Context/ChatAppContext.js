import React, { createContext, useEffect, useState } from "react";

// internal import
import {
  CheckIfWalletConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";
import { useRouter } from "next/router";

export const ChatAppConnect = React.createContext();

export const ChatAppProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  // chat user data
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  // fetch data time of page
  const fetchData = async () => {
    try {
      // Get Contract
      const contract = await connectingWithContract();
      // get account
      const connectAccount = await connectWallet();
      setAccount(connectAccount);
      // get username
      const userName = await contract.getUsername(connectAccount);
      setUserName(userName);
      // get friend list
      const friendLists = await contract.getMyFriendList();

      setFriendLists(friendLists);
      // get all app  users
      const userList = await contract.getAllAppUser();
      setUserLists(userList);
    } catch (err) {
      setError("Please Install And Connect Your wallet");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // read message
  const readMessage = async (friendAddress) => {
    try {
      // Get Contract
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (err) {
      setError("You currently have no email");
    }
  };

  // create account
  const createAccount = async ({ name, accountAddress }) => {
    try {
      if (name || accountAddress)
        return setError("Name and AccountAddress, cannot be empty");

      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);

      setLoading(true);

      await getCreatedUser.wait();
      setLoading(false);
    } catch (err) {
      setError("Error while creating your account ");
    }
  };

  // add friend

  const addFriends = async ({ name, accountAddress }) => {
    try {
      if (name || accountAddress) return setError("Please provide a friend");

      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (err) {
      setError();
    }
  };

  // send message to friend
  const sendMessage = async ({ msg, address }) => {
    try {
      if (msg || address) return setError("Please Type your Message");
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (err) {
      setError("Please reload and try again");
    }
  };

  // read info
  const readUser = async (userAddress) => {
    const contract = await connectingWithContract();
    const userName = await contract.getUsername(userAddress);
    setCurrentUserName(userName);
    setCurrentUserAddress(userAddress);
  };
  return (
    <ChatAppConnect.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        account,
        userName,
        friendLists,
        friendMsg,
        loading,
        userLists,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ChatAppConnect.Provider>
  );
};
