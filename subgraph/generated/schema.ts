// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Tournamet extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Tournamet entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Tournamet must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Tournamet", id.toString(), this);
    }
  }

  static load(id: string): Tournamet | null {
    return changetype<Tournamet | null>(store.get("Tournamet", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tournamentId(): BigInt {
    let value = this.get("tournamentId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set tournamentId(value: BigInt) {
    this.set("tournamentId", Value.fromBigInt(value));
  }

  get tournamentAddress(): Bytes {
    let value = this.get("tournamentAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set tournamentAddress(value: Bytes) {
    this.set("tournamentAddress", Value.fromBytes(value));
  }

  get compProviderAddress(): Bytes {
    let value = this.get("compProviderAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set compProviderAddress(value: Bytes) {
    this.set("compProviderAddress", Value.fromBytes(value));
  }

  get resultProviderAddress(): Bytes {
    let value = this.get("resultProviderAddress");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set resultProviderAddress(value: Bytes) {
    this.set("resultProviderAddress", Value.fromBytes(value));
  }

  get compIDs(): Array<BigInt> | null {
    let value = this.get("compIDs");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set compIDs(value: Array<BigInt> | null) {
    if (!value) {
      this.unset("compIDs");
    } else {
      this.set("compIDs", Value.fromBigIntArray(<Array<BigInt>>value));
    }
  }

  get compURIs(): Array<string> | null {
    let value = this.get("compURIs");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set compURIs(value: Array<string> | null) {
    if (!value) {
      this.unset("compURIs");
    } else {
      this.set("compURIs", Value.fromStringArray(<Array<string>>value));
    }
  }

  get tournamentURI(): string {
    let value = this.get("tournamentURI");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set tournamentURI(value: string) {
    this.set("tournamentURI", Value.fromString(value));
  }
}
