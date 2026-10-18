import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

export default function Contact() {
  const form = useRef();

  const [done, setDone] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_xnpgrfg",
        "template_73e4qfc",
        form.current,
        "7l6Iv_wai88tSd3pG"
      )
      .then(
        (result) => {
          console.log(result.text);
          setDone(true);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <div className="contact-title">
          <span>Get in Touch</span>
          <br />
          <span className="contact-highlighted-text">Contact Me</span>
          <div
            className="contact-background-1"
            style={{ background: "#ABF1FF94" }}
          ></div>
        </div>
      </div>
      <div className="contact-right">
        <form ref={form} onSubmit={sendEmail}>
          <input
            type="text"
            name="user_name"
            className="user"
            placeholder="Name"
          />
          <input
            type="email"
            name="user_email"
            className="user"
            placeholder="Email"
          />
          <textarea name="message" className="user" placeholder="Message" />
          <input type="submit" value="Send" className="button" />
          <span className="message">{done && "Thank You For Contacting!"}</span>
          <div
            className="contact-background-2"
            style={{ background: "var(--purple)" }}
          ></div>
        </form>
      </div>
    </div>
  );
}
