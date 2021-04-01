import { ergToNano } from './serializer';
import { forceUpdateState, mintRcTx, priceToMintRc } from './ageHelper';
import { ergSendPrecision } from './consts';

export async function mintRc(amount, withdrawAddress, bankBox) {
    await forceUpdateState(bankBox);
    let befPrice = await priceToMintRc(amount) + 1000000;
    let price = (befPrice / 1e9).toFixed(ergSendPrecision);
    price = ergToNano(price);
    if (price < befPrice) price += 10 ** (9 - ergSendPrecision)
    return await mintRcTx(amount, withdrawAddress);
}
