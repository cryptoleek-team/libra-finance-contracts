import hre = require("hardhat")
import { HardhatRuntimeEnvironment } from "hardhat/types"

const setAdminFee = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { execute, get, getOrNull, log, read, save } = deployments
  const { deployer } = await getNamedAccounts()

  const ADMIN_FEE = 1e9

  await execute(
    "SwapFlashLoan",
    { from: deployer, log: true, waitConfirmations: 3 },
    "setAdminFee",
    ADMIN_FEE,
  )
}

setAdminFee(hre)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
