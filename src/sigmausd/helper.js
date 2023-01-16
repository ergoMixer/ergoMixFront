import {getNetworkContext, getUserBoxData, txFee} from '../utils/assembler';
import {dollarToCent} from '../utils/serializer';
import Bank from "./Bank";
import Oracle from "./Oracle";
import Boxes from "./Boxes";
import * as wasm from 'ergo-lib-wasm-browser';
import {ErgoBoxAssetsDataList} from 'ergo-lib-wasm-browser';
import {ApiNetwork} from "../network/api";
import {MAX_RESERVE_RATIO, MIN_RESERVE_RATIO} from "./parameters";

let bankObj = undefined;
let oracleObj = undefined;

export async function forceUpdateState(bankBoxJson) {
    let body = JSON.stringify(await ApiNetwork.oracleBox());
    oracleObj = new Oracle(body)
    body = bankBoxJson;
    if(!bankBoxJson) {
        body = JSON.stringify(await ApiNetwork.bankBox())
    }
    bankObj = new Bank(body, oracleObj)
}

export async function updateState() {
    if (!bankObj || !oracleObj) await forceUpdateState();
}

export async function priceToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankObj.total_cost_to_mint_stable_coin(
            BigInt(dollarToCent(amount)),
            BigInt(await txFee())
        )
    );
}

export async function priceToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankObj.total_cost_to_mint_reserve_coin(
            BigInt(parseInt(amount)),
            BigInt(await txFee())
        )
    )
}

export async function feeToMintSc(amount) {
    if (dollarToCent(amount) === 0) return 0;

    await updateState();
    return Number(
        bankObj.fees_from_minting_stable_coin(
            BigInt(dollarToCent(amount)),
            BigInt(await txFee())
        )
    );
}

export async function feeToMintRc(amount) {
    if (parseInt(amount) === 0) return 0;

    await updateState();
    return Number(
        bankObj.fees_from_minting_reserve_coin(
            BigInt(parseInt(amount)),
            BigInt(await txFee())
        )
    )
}

export async function createMintTransaction (tx_fee, height, recipient, bank_out, inBoxes, burnTokens, user_address, oracleBoxId) {
    const outputs = new wasm.ErgoBoxCandidates(bank_out);
    outputs.add(recipient);
    const tx_builder = wasm.TxBuilder.new(
        new wasm.BoxSelection(inBoxes, new ErgoBoxAssetsDataList()),
        outputs,
        height,
        wasm.BoxValue.from_i64(
            wasm.I64.from_str(tx_fee.toString())
        ),
        user_address
    );
    const data_inputs = new wasm.DataInputs();
    data_inputs.add(new wasm.DataInput(oracleBoxId));
    tx_builder.set_data_inputs(data_inputs);
    burnTokens.len() > 0 && tx_builder.set_token_burn_permit(burnTokens)
    return tx_builder.build()
}

export async function createReducedTransaction(unSignedTx, inBoxes, dataBoxes) {
    const ctx = await getNetworkContext();
    const reducedTx = await wasm.ReducedTransaction.from_unsigned_tx(unSignedTx, inBoxes, dataBoxes, ctx);
    return Buffer.from(reducedTx.sigma_serialize_bytes()).toString('base64')
}

export async function mintTx(token_type, mixId, amount, userAddress) {
    await updateState();
    const amountBig = BigInt(amount)
    const base_required_erg =
        token_type === 'stable'
            ? bankObj.base_cost_to_mint_stable_coin(amountBig)
            : bankObj.base_cost_to_mint_reserve_coin(amountBig);
    const txFeeBigInt = BigInt(await txFee());
    const total_process_ergs = base_required_erg + txFeeBigInt;

    const height = await ApiNetwork.currentHeight();
    const userdata = await getUserBoxData(mixId)
    const inBoxes = new wasm.ErgoBoxes(bankObj.get_box())
    inBoxes.add(userdata.box)

    const bankOut = bankObj.create_candidate(
        height,
        token_type === 'stable' ? amountBig : BigInt(0),
        token_type === 'stable' ? BigInt(0) : amountBig
    );

    const buy_token = token_type === 'stable' ? Bank.STABLE_COIN_TOKEN_ID : Bank.RESERVE_COIN_TOKEN_ID

    const recipient = await Boxes.recipient_box(
        BigInt(userdata.box.value().as_i64().to_str()) - total_process_ergs,
        buy_token,
        amountBig,
        base_required_erg,
        wasm.Address.from_base58(userAddress),
        height
    );
    const unsignedTx = await createMintTransaction(
        txFeeBigInt,
        height,
        recipient,
        bankOut,
        inBoxes,
        userdata.burnTokens,
        wasm.Address.from_base58(userAddress),
        oracleObj.get_box().box_id()
    )
    const dataBoxes = await new wasm.ErgoBoxes(oracleObj.get_box())
    return await createReducedTransaction(unsignedTx, inBoxes, dataBoxes)
}

export async function maxScToMint() {
    if (!bankObj || !oracleObj) await forceUpdateState();
    if (bankObj.current_reserve_ratio(oracleObj) <= MIN_RESERVE_RATIO) return 0
    return Number(bankObj.num_able_to_mint_stable_coin());
}

export async function maxRcToMint() {
    if (!bankObj || !oracleObj) await forceUpdateState();
    if (bankObj.current_reserve_ratio(oracleObj) >= MAX_RESERVE_RATIO) return 0
    return Number(bankObj.num_able_to_mint_reserve_coin());
}

export async function scPrice() {
    if (!bankObj || !oracleObj) await forceUpdateState();
    return Number(bankObj.stable_coin_nominal_price(oracleObj));
}

export async function rcPrice() {
    if (!bankObj || !oracleObj) await forceUpdateState();
    return Number(bankObj.reserve_coin_nominal_price(oracleObj));
}
