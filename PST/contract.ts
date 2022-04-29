
import { balance } from './actions/balance';
import { mintTokens } from './actions/mintTokens';
import { transferTokens } from './actions/transferTokens';
import { PstAction, PstResult, PstState } from './types/types';

declare const ContractError;

export async function handle(
  state: PstState,
  action: PstAction
): Promise<PstResult> {
  const input = action.input;

  switch (input.function) {
    case 'mint':
      return await mintTokens(state, action);
    case 'transfer':
      return await transferTokens(state, action);
    case 'balance':
      return await balance(state, action);
    default:
      throw new ContractError(
        `No function supplied or function not recognised: "${input.function}"`
      );
  }
}
