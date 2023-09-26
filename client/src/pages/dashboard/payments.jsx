import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardHeader, CardBody, Typography, Avatar, Chip, Tooltip, Progress, Button, Input } from "@material-tailwind/react";
import { FaCreditCard, FaPaypal } from 'react-icons/fa';
const API_URL = process.env.API_URL;

const ProductDisplay = () => {
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");

  const handleCheckout = async (price, name) => {
    try {
      const productData = {
        price: price,
        name: name
      };

      const res = await axios.post(
        `${API_URL}/api/stripe-route/create-checkout-session`,
        productData
      );

      const resData = res.data;
      const url = resData.data.url;
      window.open(url);
    } catch (err) {
      console.log(err);
    }
  };
  const handlePaypalCheckout = async (price, name) => {
    try {
      const productData = {
        price: price,
        name: name
      };

      console.log(productData.price)
      const res = await axios.post(`${API_URL}/api/paypal/buy`, productData);
      const resData = res.data;
      const url = resData.data.url;
      window.open(url);
    } catch (err) {
      console.log(err);
    }
  };


  return (
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
            <Typography color="blueGray" size="2xl">
              <strong>Production Name</strong>
            </Typography>
            <div className="sm:col-span-3">
              <Input
                type="text"
                onChange={(e) => setName(e.target.value)}
                required
                isInvalid={!name}
                error={!name && "ProductionName is required"}
                helperText={(!name && "Name is required") || " "}
              />

            </div>

            <Typography color="blueGray" size="2xl">
              <strong>Price</strong>
            </Typography>
            <div className="sm:col-span-3">
              <Input
                type="text"
                onChange={(e) => setPrice(e.target.value)}
                required
                isInvalid={!price}
                error={!price && "Price is required"}
                helperText={(!price && "Price is required") || " "}
              />
            </div>
          </div>
        </CardBody>
        <div className="flex justify-center">
          <Button
            color="red"
            size="lg"
            onClick={() => handleCheckout(price, name)}
            className="mb-3"
            disabled={!price || !name}
          >
            <FaCreditCard />
          </Button>
          <Button
            color="blue"
            size="lg"
            onClick={() => handlePaypalCheckout(price, name)}
            className="mb-3 ml-3"
            disabled={!price || !name}
          >
            <FaPaypal />
          </Button>
        </div>

      </Card>
    </section>
  );
};


const handleCheckout = async () => {
  try {
    const productData = {
      price: price,
      name: name
    }

    const res = await axios.post(`${API_URL}/api/stripe-route/create-checkout-session`, productData);

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
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");

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
