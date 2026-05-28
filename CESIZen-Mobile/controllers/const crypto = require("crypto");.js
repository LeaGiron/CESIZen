const crypto = require("crypto");
const bcrypt = require("bcrypt");

const PASSWORD = "password123";

// === PARTIE A : MD5 (DANGEREUX) ===
const demonstrateMd5 = () => {
  console.log("=== PARTIE A : MD5 (DANGEREUX) ===\n");

  const md5Hash = crypto
    .createHash("md5")
    .update(PASSWORD)
    .digest("hex");

  const md5Hash2 = crypto
    .createHash("md5")
    .update(PASSWORD)
    .digest("hex");

  console.log(`Mot de passe : ${PASSWORD}`);
  console.log(`Hash MD5     : ${md5Hash}`);
  console.log(`Hash MD5 (2) : ${md5Hash2}`);
  console.log(`Identiques ? : ${md5Hash === md5Hash2}`);
  console.log("\n");
};

// === PARTIE B : bcrypt (SECURISE) ===
const demonstrateBcrypt = async () => {
  console.log("=== PARTIE B : bcrypt (SECURISE) ===\n");

  const SALT_ROUNDS = 12;

  const hash1 = await bcrypt.hash(PASSWORD, SALT_ROUNDS);
  const hash2 = await bcrypt.hash(PASSWORD, SALT_ROUNDS);

  const isValid = await bcrypt.compare(PASSWORD, hash1);
  const isInvalid = await bcrypt.compare("wrongpassword", hash1);

  console.log(`Hash bcrypt 1 : ${hash1}`);
  console.log(`Hash bcrypt 2 : ${hash2}`);
  console.log(`Identiques ?  : ${hash1 === hash2}`);
  console.log(`Bon mdp ?     : ${isValid}`);
  console.log(`Mauvais mdp ? : ${isInvalid}`);
  console.log("\n");
};

// === PARTIE C : Benchmark ===
const benchmarkSpeed = async () => {
  console.log("=== PARTIE C : Benchmark de vitesse ===\n");

  const md5Start = Date.now();
  for (let i = 0; i < 100000; i++) {
    crypto.createHash("md5").update(PASSWORD).digest("hex");
  }
  const md5Time = Date.now() - md5Start;
  console.log(`100 000 hashes MD5 : ${md5Time}ms`);

  const bcryptStart = Date.now();
  for (let i = 0; i < 10; i++) {
    await bcrypt.hash(PASSWORD, 12);
  }
  const bcryptTime = Date.now() - bcryptStart;
  console.log(`10 hashes bcrypt   : ${bcryptTime}ms`);

  const ratio = bcryptTime / md5Time;
  console.log(`Ratio bcrypt / MD5 : environ ${ratio.toFixed(2)}x plus lent`);
};

const main = async () => {
  demonstrateMd5();
  await demonstrateBcrypt();
  await benchmarkSpeed();
};

main().catch(console.error);