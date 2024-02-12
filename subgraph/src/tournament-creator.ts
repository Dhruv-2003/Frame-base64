import {
  tournamentCreated as tournamentCreatedEvent,
  tournamentInitialised as tournamentInitialisedEvent
} from "../generated/TournamentCreator/TournamentCreator"
import { tournamentCreated, tournamentInitialised } from "../generated/schema"

export function handletournamentCreated(event: tournamentCreatedEvent): void {
  let entity = new tournamentCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tournament = event.params.tournament
  entity.compProvider = event.params.compProvider
  entity.resultOracle = event.params.resultOracle
  entity.uri = event.params.uri
  entity.tournamentId = event.params.tournamentId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handletournamentInitialised(
  event: tournamentInitialisedEvent
): void {
  let entity = new tournamentInitialised(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tournamentId = event.params.tournamentId
  entity.compIDs = event.params.compIDs
  entity.compURIs = event.params.compURIs

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
