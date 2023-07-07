import React, { useState } from "react";
import API from "./api.js";

function RemoveUser() {
  const [setState] = useState(" ");

  const handleChange = (e) => {
    setState({ id: e.target.value });
  };

  const handleRemove = async (evt) => {
    evt.preventDefault();

    const response = await API.delete(`users/${this.state.id}`);

    console.log(response);
    console.log(response.data);
  };

  return (
    <div>
      Remove User
      <div>
        <form onSubmit={handleRemove}>
          <label>
            User ID:
            <input type="number" name="id" onChange={handleChange} />
          </label>
          <button type="submit">Delete</button>
        </form>
      </div>
    </div>
  );
}

export default RemoveUser;
