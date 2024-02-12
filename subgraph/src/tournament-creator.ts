import {
  tournamentCreated as tournamentCreatedEvent,
  tournamentInitialised as tournamentInitialisedEvent,
} from "../generated/TournamentCreator/TournamentCreator";
import { Tournament } from "../generated/schema";

export function handletournamentCreated(event: tournamentCreatedEvent): void {
  let entity = new Tournament(event.params.tournamentId.toString());
  entity.tournamentAddress = event.params.tournament;
  entity.compProviderAddress = event.params.compProvider;
  entity.resultProviderAddress = event.params.resultOracle;
  entity.tournamentURI = event.params.uri;
  entity.tournamentId = event.params.tournamentId;
  entity.save();
}

export function handletournamentInitialised(
  event: tournamentInitialisedEvent
): void {
  let entity = Tournament.load(event.params.tournamentId.toString());

  if (!entity) {
    return;
  }

  entity.compIDs = event.params.compIDs;
  entity.compURIs = event.params.compURIs;

  entity.save();
}
