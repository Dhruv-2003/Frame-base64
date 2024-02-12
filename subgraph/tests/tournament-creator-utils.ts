import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  tournamentCreated,
  tournamentInitialised
} from "../generated/TournamentCreator/TournamentCreator"

export function createtournamentCreatedEvent(
  tournament: Address,
  compProvider: Address,
  resultOracle: Address,
  uri: string,
  tournamentId: BigInt
): tournamentCreated {
  let tournamentCreatedEvent = changetype<tournamentCreated>(newMockEvent())

  tournamentCreatedEvent.parameters = new Array()

  tournamentCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tournament",
      ethereum.Value.fromAddress(tournament)
    )
  )
  tournamentCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "compProvider",
      ethereum.Value.fromAddress(compProvider)
    )
  )
  tournamentCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "resultOracle",
      ethereum.Value.fromAddress(resultOracle)
    )
  )
  tournamentCreatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  tournamentCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "tournamentId",
      ethereum.Value.fromUnsignedBigInt(tournamentId)
    )
  )

  return tournamentCreatedEvent
}

export function createtournamentInitialisedEvent(
  tournamentId: BigInt,
  compIDs: Array<BigInt>,
  compURIs: Array<string>
): tournamentInitialised {
  let tournamentInitialisedEvent = changetype<tournamentInitialised>(
    newMockEvent()
  )

  tournamentInitialisedEvent.parameters = new Array()

  tournamentInitialisedEvent.parameters.push(
    new ethereum.EventParam(
      "tournamentId",
      ethereum.Value.fromUnsignedBigInt(tournamentId)
    )
  )
  tournamentInitialisedEvent.parameters.push(
    new ethereum.EventParam(
      "compIDs",
      ethereum.Value.fromUnsignedBigIntArray(compIDs)
    )
  )
  tournamentInitialisedEvent.parameters.push(
    new ethereum.EventParam(
      "compURIs",
      ethereum.Value.fromStringArray(compURIs)
    )
  )

  return tournamentInitialisedEvent
}
