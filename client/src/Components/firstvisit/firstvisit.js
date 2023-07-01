import React from 'react';
import { useContext } from "react";
import { Context } from "../../Context"
import Button from '@mui/material/Button';

export default function FirstVisit() {
  const { handleCreateUser, user } = useContext(Context);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const newUser = { ...formJson, email: user.email };
    handleCreateUser(newUser);
  };

  return (
    <div className="first-visit-container">
      <div className="first-visit-header-container">
        <div style={{ fontWeight: "bold", color: "white" }}>
          <h2 className="fist-visit-header">
            Create a display name
          </h2>
        </div>
        <form
          className="first-visit-form"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div className="first">
            <div style={{ fontWeight: "bold", color: "white" }}>
              <label
                htmlFor="first-name"
                className="first-name-first-name"
              >
              </label>
              <input
                id="first-name"
                name="name"
                autoComplete="firstname"
                required
                className="name"
                placeholder="Display name"
              />
            </div>
          </div>
<p></p>
          <div className="first-visit-submit-button">
            <Button style={{ backgroundColor: 'white', color: '#1876D1', fontWeight: 'bold' }} variant="contained"
              type="submit"
              className="submit-button"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
