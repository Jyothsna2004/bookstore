const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AbfeDGr_dwSk6wncQWRQDwB47CMZj-Y9J9MRzUXPrA5v9oypUgHGgeHexLIQYNtEpuBH-aCUEK_Y2h7u",
  client_secret: "EBy74Al3YLwAipKx_7b6_av1Cd9tYR5x_UQdGHhweXIQWJ-pJOfAJdYKI8w5LxnUIhBhD-HqX4IWRNNB",
});

module.exports = paypal;