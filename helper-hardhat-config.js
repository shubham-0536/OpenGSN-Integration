const networkConfig = {
  80001: {
    /**
     * reference:
     * (RelayHub、Forwarder)
     * https://docs.opengsn.org/networks/polygon/mumbai.html
     * (Relay)
     * https://relays.opengsn.org/
     */
    name: "mumbai",
    RelayHub: "0x3232f21A6E08312654270c78A773f00dd61d60f5",
    Forwarder: "0xB2b5841DBeF766d4b521221732F9B618fCf34A87",
    Relay: "0x6fae20662d026a775487edf62f4aed94272dbb9e",
  },
  421613: {
    name: "goerli",
    RelayHub: "0x064Ddcc99C7D0FDC8E2aB4f9330d5F603F9A8435",
    Forwarder: "0xB2b5841DBeF766d4b521221732F9B618fCf34A87",
    Relay: "0x904ae4275C8B496C2B7593B885Ba4083565C73Dd",
  },
  42161: {
    /**
     * reference:
     * (RelayHub、Forwarder)
     * https://docs.opengsn.org/networks/polygon/mumbai.html
     * (Relay)
     * https://relays.opengsn.org/
     */
    name: "arbitrum",
    RelayHub: "0xfCEE9036EDc85cD5c12A9De6b267c4672Eb4bA1B",
    Forwarder: "0xB2b5841DBeF766d4b521221732F9B618fCf34A87",
    // Relay: "0x904ae4275C8B496C2B7593B885Ba4083565C73Dd",
  },
};

module.exports = {
  networkConfig,
};
