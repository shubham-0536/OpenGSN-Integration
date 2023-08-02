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
    RelayHub: "0xE0DB8124422f076C4C5F0475b3aFa416bBd1c9C7",
    Forwarder: "0x1bC8BF2D4EaE8df844a3b2A015369d42AcF3121C",
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
    RelayHub: "0x62f25d0aADe30dB35232Cf38ead95B994BC1E335",
    Forwarder: "0xEC9B715137355a32d73E8DcD7D66FbAA3E61C5b8",
    // Relay: "0x904ae4275C8B496C2B7593B885Ba4083565C73Dd",
  },
};

module.exports = {
  networkConfig,
};
