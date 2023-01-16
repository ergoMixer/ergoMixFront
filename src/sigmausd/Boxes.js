import * as wasm from 'ergo-lib-wasm-browser';

class Boxes {

  static recipient_box = async (
    amount,
    token_id,
    token_amount,
    base_required_erg,
    user_address,
    height
  ) => {
    const recipient_builder = await new wasm.ErgoBoxCandidateBuilder(
      wasm.BoxValue.from_i64(wasm.I64.from_str(amount.toString())),
      wasm.Contract.pay_to_address(user_address),
      height
    );
    recipient_builder.add_token(
        wasm.TokenId.from_str(token_id),
        wasm.TokenAmount.from_i64(
            wasm.I64.from_str(token_amount.toString())
        )
    );
    recipient_builder.set_register_value(
      4,
      wasm.Constant.from_i64(wasm.I64.from_str(token_amount.toString()))
    );
    recipient_builder.set_register_value(
      5,
      wasm.Constant.from_i64(wasm.I64.from_str(base_required_erg.toString()))
    );
    return recipient_builder.build();
  };
}

export default Boxes;
