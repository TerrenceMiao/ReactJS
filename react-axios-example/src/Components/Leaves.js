import React, { useEffect, useState } from "react";
import axios from "axios";

function Leaves() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    axios
      .request({
        url: "https://commando.local:8443/digitalworkspace/sap/v1/employee/leave-balances?leave-type=RECREATIONAL",
        method: "GET",
        proxy: {
          host: "localhost",
          port: 9090,
        },
      })
      .then((data) => {
        console.log(data);
        setPost(data?.data);
      });
  }, []);

  return (
    <div>
      Leaves
      {post.map((item, i) => {
        return (
          <div key={i}>
            <p>{item?.name}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Leaves;
