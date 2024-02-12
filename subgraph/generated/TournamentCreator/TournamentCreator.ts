// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class tournamentCreated extends ethereum.Event {
  get params(): tournamentCreated__Params {
    return new tournamentCreated__Params(this);
  }
}

export class tournamentCreated__Params {
  _event: tournamentCreated;

  constructor(event: tournamentCreated) {
    this._event = event;
  }

  get tournament(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get compProvider(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get resultOracle(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get uri(): string {
    return this._event.parameters[3].value.toString();
  }

  get tournamentId(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class tournamentInitialised extends ethereum.Event {
  get params(): tournamentInitialised__Params {
    return new tournamentInitialised__Params(this);
  }
}

export class tournamentInitialised__Params {
  _event: tournamentInitialised;

  constructor(event: tournamentInitialised) {
    this._event = event;
  }

  get tournamentId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get compIDs(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }

  get compURIs(): Array<string> {
    return this._event.parameters[2].value.toStringArray();
  }
}

export class TournamentCreator__tournamentsResult {
  value0: Address;
  value1: Address;
  value2: Address;
  value3: string;

  constructor(
    value0: Address,
    value1: Address,
    value2: Address,
    value3: string
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromAddress(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromString(this.value3));
    return map;
  }

  getTournament(): Address {
    return this.value0;
  }

  getCompProvider(): Address {
    return this.value1;
  }

  getResultOracle(): Address {
    return this.value2;
  }

  getUri(): string {
    return this.value3;
  }
}

export class TournamentCreator extends ethereum.SmartContract {
  static bind(address: Address): TournamentCreator {
    return new TournamentCreator("TournamentCreator", address);
  }

  admin(): Address {
    let result = super.call("admin", "admin():(address)", []);

    return result[0].toAddress();
  }

  try_admin(): ethereum.CallResult<Address> {
    let result = super.tryCall("admin", "admin():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  totalTournaments(): BigInt {
    let result = super.call(
      "totalTournaments",
      "totalTournaments():(uint256)",
      []
    );

    return result[0].toBigInt();
  }

  try_totalTournaments(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "totalTournaments",
      "totalTournaments():(uint256)",
      []
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  tournaments(param0: BigInt): TournamentCreator__tournamentsResult {
    let result = super.call(
      "tournaments",
      "tournaments(uint256):(address,address,address,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );

    return new TournamentCreator__tournamentsResult(
      result[0].toAddress(),
      result[1].toAddress(),
      result[2].toAddress(),
      result[3].toString()
    );
  }

  try_tournaments(
    param0: BigInt
  ): ethereum.CallResult<TournamentCreator__tournamentsResult> {
    let result = super.tryCall(
      "tournaments",
      "tournaments(uint256):(address,address,address,string)",
      [ethereum.Value.fromUnsignedBigInt(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new TournamentCreator__tournamentsResult(
        value[0].toAddress(),
        value[1].toAddress(),
        value[2].toAddress(),
        value[3].toString()
      )
    );
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class CreateTournamentCall extends ethereum.Call {
  get inputs(): CreateTournamentCall__Inputs {
    return new CreateTournamentCall__Inputs(this);
  }

  get outputs(): CreateTournamentCall__Outputs {
    return new CreateTournamentCall__Outputs(this);
  }
}

export class CreateTournamentCall__Inputs {
  _call: CreateTournamentCall;

  constructor(call: CreateTournamentCall) {
    this._call = call;
  }

  get tournamentURI(): string {
    return this._call.inputValues[0].value.toString();
  }
}

export class CreateTournamentCall__Outputs {
  _call: CreateTournamentCall;

  constructor(call: CreateTournamentCall) {
    this._call = call;
  }
}

export class InitialiseTournamentCall extends ethereum.Call {
  get inputs(): InitialiseTournamentCall__Inputs {
    return new InitialiseTournamentCall__Inputs(this);
  }

  get outputs(): InitialiseTournamentCall__Outputs {
    return new InitialiseTournamentCall__Outputs(this);
  }
}

export class InitialiseTournamentCall__Inputs {
  _call: InitialiseTournamentCall;

  constructor(call: InitialiseTournamentCall) {
    this._call = call;
  }

  get tournamentId(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get compIDs(): Array<BigInt> {
    return this._call.inputValues[1].value.toBigIntArray();
  }

  get compURIs(): Array<string> {
    return this._call.inputValues[2].value.toStringArray();
  }
}

export class InitialiseTournamentCall__Outputs {
  _call: InitialiseTournamentCall;

  constructor(call: InitialiseTournamentCall) {
    this._call = call;
  }
}