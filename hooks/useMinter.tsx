import busd_minter_abi from "../contracts/busd_MINTER.json";
import type { BusdMINTER } from "../contracts/types";
import useContract from "./useContract";

export default function useMinter(tokenAddress?: string) {
  return useContract<BusdMINTER>("0x884aFe9CbB26C27622bccD5D469607515B721b4E", busd_minter_abi);
}