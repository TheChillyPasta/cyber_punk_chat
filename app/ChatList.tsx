import React from "react";
import ContactBox from "../components/ContactBox";
import avatar from "../assets/images/avatar.jpg";
import axios from "axios";
import { useCookies } from "react-cookie";

const ChatList = () => {

  const [chats, setChats] = React.useState<any>([]);
  const [cookies, setCookie] = useCookies(["access_token"]);

  React.useEffect(() => {
    async function get_chats() {
      let data = JSON.stringify({
        participants: ["ani@g.com"],
      });

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `${process.env.VITE_API_URL}/api/chats`,
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios
        .request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
          return response;
        })
        .catch((error) => {
          console.log(error);
        });

      const chats = await response;
      console.log(chats);

      setChats(
        chats?.data &&
          chats?.data.map((value: any, index: any) => ({
            ...value,
            avatar: avatar,
            name: `User${index}`,
          }))
      );
    }
    get_chats();
  }, []);
  
  return (
    <div className="flex flex-col flex-nowrap bg-default grow-1 h-auto">
      {chats?.map((val: any) => (
        <ContactBox contactDetails={val} key={val?.name} />
      ))}
    </div>
  );
};

export default ChatList;
