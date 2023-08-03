import Mailgun from "mailgun.js";
import formData from "form-data";

const mailgun = new Mailgun(formData);

const mailgunClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

// When user creates their account
export const sendWelcomeEmail = async (email, name) => {
  await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
    from: "Sam <samanbha.ug20@nsut.ac.in>",
    to: email,
    subject: "Thanks for joining us!",
    text: `Welcome to the Task Manager Application ${name}! Hope you enjoy this application.`,
  });
};

// When user deletes their account
export const sendCancellationEmail = async (email, name) => {
  await mailgunClient.messages.create(process.env.MAILGUN_DOMAIN, {
    from: "Sam <samanbha.ug20@nsut.ac.in>",
    to: email,
    subject: "We're sorry to see you go..",
    text: `Sayonara ${name}. Hope you enjoyed this application.`,
  });
};
