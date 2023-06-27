import React from 'react';
import styles from './firstvisit.module.css';
import { useContext } from "react";
import { Context } from "../../Context"

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
        <div>
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
            <div className=" ">
              <label
                htmlFor="first-name"
                className="first-name-first-name"
              >
                Display name
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

          <div className="first-visit-submit-button">
            <button
              type="submit"
              className="submit-button"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
