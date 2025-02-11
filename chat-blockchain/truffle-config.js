module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545, // Ensure this matches the port Ganache is using
      network_id: "*", // Match any network id
    },
  },
  compilers: {
    solc: {
      version: "0.8.0", // Fetch exact version from solc-bin
    },
  },
};
