async function main() {
  const Identity = await ethers.getContractFactory("Identity");
  const identity = await Identity.deploy();
  await identity.waitForDeployment();
  console.log("Identity deployed to:", await identity.getAddress());
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
