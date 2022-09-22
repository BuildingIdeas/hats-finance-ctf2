const { expect } = require("chai");

describe("Vault contract", function () {
  let vault;
  let deployer;
  beforeEach(async function () {
    const Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy({ value: ethers.utils.parseEther("1") });
  });

  it("Deposit", async function () {
    [deployer, depositor] = await ethers.getSigners();

    const flagHolder = await vault.flagHolder();
    expect(flagHolder).to.equal("0x0000000000000000000000000000000000000000");

    const tx = await vault.connect(depositor).deposit(
      ethers.utils.parseEther("1"),
      depositor.address,
      { value: ethers.utils.parseEther("1") }
    );
    await tx.wait();
    expect(await vault.balanceOf(depositor.address)).to.equal(ethers.utils.parseEther("1"));

    await expect(
      vault.connect(depositor).captureTheFlag(depositor.address)
    ).to.be.revertedWith("Balance is not 0");
  });

  it("Withdraw", async function () {
    [deployer, depositor] = await ethers.getSigners();

    const flagHolder = await vault.flagHolder();
    expect(flagHolder).to.equal("0x0000000000000000000000000000000000000000");

    let tx = await vault.connect(depositor).deposit(
      ethers.utils.parseEther("1"),
      depositor.address,
      { value: ethers.utils.parseEther("1") }
    );
    await tx.wait();
    expect(await vault.balanceOf(depositor.address)).to.equal(ethers.utils.parseEther("1"));
  
     tx = await vault.connect(depositor).withdraw(
      ethers.utils.parseEther("1"),
      depositor.address,
      depositor.address,
    );

    await tx.wait();
    expect(await vault.balanceOf(depositor.address)).to.equal(ethers.utils.parseEther("0"));

    await expect(
      vault.connect(depositor).captureTheFlag(depositor.address)
    ).to.be.revertedWith("Balance is not 0");
  });

  it("Capture the flag", async function () {
    const [wallet1, wallet2, hacker] = await ethers.getSigners();
    const ExploitFactory = await ethers.getContractFactory("Exploit");
    const exploitInstance = await ExploitFactory.deploy(vault.address);

    // Santypk4.eth - BuildingIdeas.io
    const newFlag = '0x2aB662D37C07964d32DBE957ea1682A2C3d48e9F';
    let tx0 = await exploitInstance.connect(hacker).run(newFlag, { value: ethers.utils.parseEther("1"), });
    await tx0.wait();

    const flag = await vault.flagHolder();
    await expect(
      flag
    ).to.be.equal(newFlag);
  });
});
