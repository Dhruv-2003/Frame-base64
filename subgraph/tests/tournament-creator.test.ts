import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { tournamentCreated } from "../generated/schema"
import { tournamentCreated as tournamentCreatedEvent } from "../generated/TournamentCreator/TournamentCreator"
import { handletournamentCreated } from "../src/tournament-creator"
import { createtournamentCreatedEvent } from "./tournament-creator-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let tournament = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let compProvider = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let resultOracle = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let uri = "Example string value"
    let tournamentId = BigInt.fromI32(234)
    let newtournamentCreatedEvent = createtournamentCreatedEvent(
      tournament,
      compProvider,
      resultOracle,
      uri,
      tournamentId
    )
    handletournamentCreated(newtournamentCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("tournamentCreated created and stored", () => {
    assert.entityCount("tournamentCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "tournamentCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tournament",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "tournamentCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "compProvider",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "tournamentCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "resultOracle",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "tournamentCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "uri",
      "Example string value"
    )
    assert.fieldEquals(
      "tournamentCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tournamentId",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
