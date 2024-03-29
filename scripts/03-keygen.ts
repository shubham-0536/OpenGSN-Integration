import path from "path";
import fs from "fs";
import { ethers } from "ethers";

// npx ts-node scripts/keygen.ts
function main() {
  const folder = "./tmp";

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  const keyFile = path.join(folder, "key.json");
  const wallet = ethers.Wallet.createRandom();

  const data = {
    address: wallet.address,
    mnemonic: wallet.mnemonic.phrase,
  };

  console.log(data);

  fs.writeFileSync(keyFile, JSON.stringify(data), "utf8");
}

main();