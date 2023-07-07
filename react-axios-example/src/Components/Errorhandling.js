import axios from "axios";
import React, { useEffect, useState } from "react";

function Errorhandling() {
  const [users, setUsers] = useState([]);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    axios
      .get(`https://jsonplaceholder.typicode.com/posts/obmm`)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  if (error) return `Error: ${error?.message}`;
  if (!users) return "No user!";

  return (
    <div>
      Errorhandling
      <div>
        Users
        {users.map((item, i) => {
          return (
            <div key={i}>
              <p>{item?.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Errorhandling;
