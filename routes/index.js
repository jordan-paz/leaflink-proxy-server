const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();
const apiKey = process.env.LEAFLINK_API_KEY;

const getOrders = () => {
  return fetch("https://leaflink.com/api/v2/orders-received/", {
    method: "get",
    headers: { Authorization: apiKey }
  })
    .then(res => res.json())
    .then(json => json.results);
};

const getCustomerIds = async () => {
  const orders = await getOrders();
  return orders.map(order => order.customer.id);
};

const getCustomer = customerId => {
  const url = `https://leaflink.com/api/v2/customers/?id=${customerId}`;
  return fetch(url, {
    method: "get",
    headers: { Authorization: apiKey }
  })
    .then(res => res.json())
    .then(json => json.results[0]);
};

const getCustomers = async () => {
  const customerIds = await getCustomerIds();
  const customers = await Promise.all(customerIds.map(id => getCustomer(id)));
  return Array.from(new Set(customers));
};

router.get("/", async (req, res) => {
  return res.send(await getCustomers());
});

module.exports = router;
