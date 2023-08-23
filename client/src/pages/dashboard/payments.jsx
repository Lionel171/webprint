import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Tooltip, Progress, Button } from "@material-tailwind/react";
const API_URL = process.env.API_URL;

const ProductDisplay = () => (
  <section className="flex justify-center items-center  h-screen">
    <Card>
      <CardHeader color="blue" contentPosition="none">
        <img
          src="/img/credit-card.png"
          alt="The cover of Stubborn Attachments"
        />
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center">

          <Typography color="blueGray" size="2xl" >
            <strong>$1500.00</strong>
          </Typography>
        </div>
      </CardBody>
      <div className="flex justify-center">
        <Button className="mb-3"
          color="lightBlue"
          // buttonType="filled"
          size="lg"
          // rounded={false}
          // block={false}
          // icononly={false}
          // ripple="light"
          onClick={handleCheckout}
        >
          Checkout
        </Button>
      </div>
    </Card>
  </section>
);

const handleCheckout = async () => {
  try {
    const res = await axios.post(`${API_URL}/api/stripe-route/create-checkout-session`);

    const resData = res.data;
    const url = resData.data.url;
    window.open(url);
  } catch (err) {
    console.log(err)
  }
}

const Message = ({ message }) => (
  <section className="flex justify-center items-center h-screen mb-4">
    <Card>
      <Typography className="mt-4 mr-4 mb-4 ml-4">
        <strong>{message}!</strong>
      </Typography>
    </Card>
  </section>

);

export function Payments() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  return message ? (
    <Message message={message} />
  ) : (
    <ProductDisplay />
  );
}

export default Payments;
