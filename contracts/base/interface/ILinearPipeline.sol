// SPDX-License-Identifier: ISC
/**
* By using this software, you understand, acknowledge and accept that Tetu
* and/or the underlying software are provided “as is” and “as available”
* basis and without warranties or representations of any kind either expressed
* or implied. Any use of this open source software released under the ISC
* Internet Systems Consortium license is done at your own risk to the fullest
* extent permissible pursuant to applicable law any and all liability as well
* as all warranties, including any fitness for a particular purpose with respect
* to Tetu and/or the underlying software and the use thereof are disclaimed.
*/

pragma solidity 0.8.4;

import "./IPipe.sol";

interface ILinearPipeline {

  function pipes(uint index) external view returns (IPipe);

  function pipesLength() external view returns (uint);

  function isRebalanceNeeded() external view returns (bool);

  function getMostUnderlyingBalance() external view returns (uint);

  function getAmountOutReverted(uint256 amountIn, uint256 toPipeIndex) external;

}
