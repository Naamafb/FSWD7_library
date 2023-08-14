import { useParams, useEffect, useState, version } from "react";
import styles from "./Info.module.css";
import React from "react";

function Messages(){

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [myMessages,setMyMessages]= useState([]);
    const [findMessages ,setFindMessages] = useState(false);
    
    useEffect(()=>{
    //debugger;
      const url = `http://localhost:3000/messages/users/${user.id}`;

      const requestMessages = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      fetch(url, requestMessages)
        .then((response) => response.json())
        .then((data) => {
          const sortedMessages = [...data].sort((a, b) => new Date(b.recive_date) -  new Date(a.recive_date));

          setMyMessages(sortedMessages);
          if(sortedMessages.length>0)
           setFindMessages(true);
        })
        .catch(() => setFindMessages(false));
    
    console.log(setFindMessages)
    },[])


    let myMessagesHtml = null; 
    if (findMessages) {
        debugger  
        if (myMessages.length > 0) {
            myMessagesHtml = myMessages.map((messages) => {
            return (
                <tr key={messages.message_id}>
                    <td>
                        <h3>{messages.title}</h3>
                        <pre>{messages.body}</pre>
                    </td>
                </tr>
                )
                })
        }
        else {
             <tr><td colSpan="6">No messages found.</td></tr>;
        }
    
        return (
            <div>
            {myMessagesHtml !== null&&(
                <div className={styles["user-card"]}>
                    <table>
                        <tbody>
                            {myMessagesHtml}
                        </tbody>
                    </table>
                </div>
                )}
            </div>
        )
    } 
    else {
        return <p>you don't have messages</p>;
    }
    

}
export default Messages;