import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/signers";
import {Announcer, Controller, IStrategy, TetuProxyControlled} from "../../../typechain";
import {ethers, web3} from "hardhat";
import {DeployerUtils} from "../../../scripts/deploy/DeployerUtils";
import {TimeUtils} from "../../TimeUtils";
import {UniswapUtils} from "../../UniswapUtils";
import {CoreContractsWrapper} from "../../CoreContractsWrapper";
import {Erc20Utils} from "../../Erc20Utils";
import {MaticAddresses} from "../../MaticAddresses";

const {expect} = chai;
chai.use(chaiAsPromised);

describe("Announcer tests", function () {
  let snapshotBefore: string;
  let snapshot: string;
  let signer: SignerWithAddress;
  let signer1: SignerWithAddress;
  let core: CoreContractsWrapper;
  let controller: Controller;
  let announcer: Announcer;
  let timeLockDuration: number;

  before(async function () {
    snapshotBefore = await TimeUtils.snapshot();
    signer = (await ethers.getSigners())[0];
    signer1 = (await ethers.getSigners())[1];
    core = await DeployerUtils.deployAllCoreContracts(signer);
    controller = core.controller;
    announcer = core.announcer;
    timeLockDuration = (await core.announcer.timeLock()).toNumber();

    await UniswapUtils.wrapMatic(signer); // 10m wmatic
  });

  after(async function () {
    await TimeUtils.rollback(snapshotBefore);
  });


  beforeEach(async function () {
    snapshot = await TimeUtils.snapshot();
  });

  afterEach(async function () {
    await TimeUtils.rollback(snapshot);
  });

  it("should change gov with time-lock", async () => {
    const opCode = 0;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setGovernance(signer1.address);

    expect(await controller.governance()).is.eq(signer1.address);
  });

  it("should change dao with time-lock", async () => {
    const opCode = 1;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setDao(signer1.address);

    expect(await controller.dao()).is.eq(signer1.address);
  });

  it("should change FeeRewardForwarder with time-lock", async () => {
    const opCode = 2;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setFeeRewardForwarder(signer1.address);

    expect(await controller.feeRewardForwarder()).is.eq(signer1.address);
  });

  it("should change Bookkeeper with time-lock", async () => {
    const opCode = 3;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setBookkeeper(signer1.address);

    expect(await controller.bookkeeper()).is.eq(signer1.address);
  });

  it("should change MintHelper with time-lock", async () => {
    const opCode = 4;

    const mintHelper = (await DeployerUtils.deployMintHelper(
        signer, core.controller.address, [signer.address], [3000]))[0].address;

    await announcer.announceAddressChange(opCode, mintHelper);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(mintHelper);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setMintHelper(mintHelper);

    expect(await controller.mintHelper()).is.eq(mintHelper);
  });

  it("should change RewardToken with time-lock", async () => {
    const opCode = 5;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setRewardToken(signer1.address);

    expect(await controller.rewardToken()).is.eq(signer1.address);
  });

  it("should change FundToken with time-lock", async () => {
    const opCode = 6;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setFundToken(signer1.address);

    expect(await controller.fundToken()).is.eq(signer1.address);
  });

  it("should change PsVault with time-lock", async () => {
    const opCode = 7;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setPsVault(signer1.address);

    expect(await controller.psVault()).is.eq(signer1.address);
  });

  it("should change Fund with time-lock", async () => {
    const opCode = 8;
    await announcer.announceAddressChange(opCode, signer1.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(signer1.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setFund(signer1.address);

    expect(await controller.fund()).is.eq(signer1.address);
  });

  it("should change ps ratio with time-lock", async () => {
    const opCode = 9;
    const num = 7;
    const den = 56;
    await announcer.announceRatioChange(opCode, num, den);

    const opHash = web3.utils.keccak256(web3.utils.encodePacked(opCode, num, den) as string);
    expect(await announcer.timeLockSchedule(opHash)).is.not.eq(0);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(0);
    expect(info.numValues.length).is.eq(2);
    expect(info.numValues[0]).is.eq(num);
    expect(info.numValues[1]).is.eq(den);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setPSNumeratorDenominator(num, den);

    expect(await controller.psNumerator()).is.eq(num);
    expect(await controller.psDenominator()).is.eq(den);
  });

  it("should change fund ratio with time-lock", async () => {
    const opCode = 10;
    const num = 7;
    const den = 56;
    await announcer.announceRatioChange(opCode, num, den);

    const opHash = web3.utils.keccak256(web3.utils.encodePacked(opCode, num, den) as string);
    expect(await announcer.timeLockSchedule(opHash)).is.not.eq(0);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(0);
    expect(info.numValues.length).is.eq(2);
    expect(info.numValues[0]).is.eq(num);
    expect(info.numValues[1]).is.eq(den);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setFundNumeratorDenominator(num, den);

    expect(await controller.fundNumerator()).is.eq(num);
    expect(await controller.fundDenominator()).is.eq(den);
  });

  it("should controller token salvage with time-lock", async () => {
    const opCode = 11;
    const amount = 1000;

    await Erc20Utils.transfer(MaticAddresses.WMATIC_TOKEN, signer, core.controller.address, amount.toString());

    const balUser = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, signer.address);
    const balController = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, core.controller.address);

    await announcer.announceTokenMove(opCode, core.controller.address, MaticAddresses.WMATIC_TOKEN, amount);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0].toLowerCase()).is.eq(MaticAddresses.WMATIC_TOKEN);
    expect(info.numValues.length).is.eq(1);
    expect(info.numValues[0]).is.eq(amount);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.salvage(MaticAddresses.WMATIC_TOKEN, amount);

    const balUserAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, signer.address);
    const balControllerAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, core.controller.address);

    expect(balUserAfter).is.eq(balUser.add(amount));
    expect(balControllerAfter).is.eq(balController.sub(amount));
  });

  it("should strategy token salvage with time-lock", async () => {
    const opCode = 12;
    const amount = 1000;
    const contract = await core.psVault.strategy();

    await Erc20Utils.transfer(MaticAddresses.WMATIC_TOKEN, signer, contract, amount.toString());

    const balUser = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, signer.address);
    const balContract = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, contract);

    await announcer.announceTokenMove(opCode, contract, MaticAddresses.WMATIC_TOKEN, amount);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(contract);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0].toLowerCase()).is.eq(MaticAddresses.WMATIC_TOKEN);
    expect(info.numValues.length).is.eq(1);
    expect(info.numValues[0]).is.eq(amount);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.salvageStrategy(contract, MaticAddresses.WMATIC_TOKEN, amount);

    const balUserAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, signer.address);
    const balContractAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, contract);

    expect(balUserAfter).is.eq(balUser.add(amount));
    expect(balContractAfter).is.eq(balContract.sub(amount));
  });

  it("should fund token salvage with time-lock", async () => {
    const opCode = 13;
    const amount = 1000;
    const contract = await core.fundKeeper.address;

    await Erc20Utils.transfer(MaticAddresses.WMATIC_TOKEN, signer, contract, amount.toString());

    const balUser = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, core.controller.address);
    const balContract = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, contract);

    await announcer.announceTokenMove(opCode, contract, MaticAddresses.WMATIC_TOKEN, amount);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(contract);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0].toLowerCase()).is.eq(MaticAddresses.WMATIC_TOKEN);
    expect(info.numValues.length).is.eq(1);
    expect(info.numValues[0]).is.eq(amount);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.salvageFund(contract, MaticAddresses.WMATIC_TOKEN, amount);

    const balUserAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, core.controller.address);
    const balContractAfter = await Erc20Utils.balanceOf(MaticAddresses.WMATIC_TOKEN, contract);

    expect(balUserAfter).is.eq(balUser.add(amount));
    expect(balContractAfter).is.eq(balContract.sub(amount));
  });

  it("should upgrade proxy with time-lock", async () => {
    const opCode = 14;

    const proxyAdr = core.psVault.address;
    const proxy = await DeployerUtils.connectContract(signer, 'TetuProxyControlled', proxyAdr) as TetuProxyControlled;
    const newImpl = await DeployerUtils.deployContract(signer, 'SmartVault');

    await announcer.announceTetuProxyUpgradeBatch([proxyAdr], [newImpl.address]);

    const index = await announcer.multiTimeLockIndexes(opCode, proxyAdr);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(proxyAdr);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(newImpl.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.upgradeTetuProxyBatch([proxyAdr], [newImpl.address]);

    expect(await proxy.implementation()).is.eq(newImpl.address);
  });

  it("should upgrade strategy with time-lock", async () => {
    const opCode = 15;

    const target = core.psVault.address;
    const newImpl = await DeployerUtils.deployContract(signer, 'NoopStrategy',
        controller.address, core.rewardToken.address, core.psVault.address, [], [core.rewardToken.address]) as IStrategy;

    await announcer.announceStrategyUpgrades([target], [newImpl.address]);

    const index = await announcer.multiTimeLockIndexes(opCode, target);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(target);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(newImpl.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setVaultStrategyBatch([target], [newImpl.address]);

    expect(await core.psVault.strategy()).is.eq(newImpl.address);
  });

  it("should mint with time-lock", async () => {
    const opCode = 16;
    const balanceSigner = await Erc20Utils.balanceOf(core.rewardToken.address, signer.address);
    const balanceNotifier = await Erc20Utils.balanceOf(core.rewardToken.address, core.notifyHelper.address);
    const balanceFund = await Erc20Utils.balanceOf(core.rewardToken.address, core.fundKeeper.address);

    const toMint = 10_000;
    await announcer.announceMint(toMint, core.notifyHelper.address, core.fundKeeper.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);

    expect(info.target).is.eq(core.mintHelper.address);
    expect(info.adrValues.length).is.eq(2);
    expect(info.adrValues[0]).is.eq(core.notifyHelper.address);
    expect(info.adrValues[1]).is.eq(core.fundKeeper.address);
    expect(info.numValues.length).is.eq(1);
    expect(info.numValues[0]).is.eq(toMint);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.mintAndDistribute(toMint, core.notifyHelper.address, core.fundKeeper.address);

    const curNetAmount = toMint * 0.33;
    const forVaults = curNetAmount * 0.7;
    const forDev = curNetAmount * 0.3;

    expect(await Erc20Utils.balanceOf(core.rewardToken.address, core.notifyHelper.address))
    .is.eq(balanceNotifier.add(forVaults));

    expect(await Erc20Utils.balanceOf(core.rewardToken.address, core.fundKeeper.address))
    .is.eq(balanceFund.add(toMint - curNetAmount));

    expect(await Erc20Utils.balanceOf(core.rewardToken.address, signer.address))
    .is.eq(balanceSigner.add(forDev));
  });

  it("should change Announcer with time-lock", async () => {
    const opCode = 17;

    const newAnnouncer = (await DeployerUtils.deployAnnouncer(signer, core.controller.address, 1))[0];

    await announcer.announceAddressChange(opCode, newAnnouncer.address);

    const index = await announcer.timeLockIndexes(opCode);
    expect(index).is.eq(1);

    const info = await announcer.timeLockInfo(index);
    expect(info.target).is.eq(core.controller.address);
    expect(info.adrValues.length).is.eq(1);
    expect(info.adrValues[0]).is.eq(newAnnouncer.address);
    expect(info.numValues.length).is.eq(0);

    await TimeUtils.advanceBlocksOnTs(timeLockDuration);

    await controller.setAnnouncer(newAnnouncer.address);

    expect(await controller.announcer()).is.eq(newAnnouncer.address);
  });

  it("should not mint zero amount", async () => {
    await expect(core.announcer.announceMint(0, core.notifyHelper.address, core.fundKeeper.address)).rejectedWith('zero amount');
  });

});
