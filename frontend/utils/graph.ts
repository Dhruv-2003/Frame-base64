import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const API_URL = "https://api.studio.thegraph.com/query/46388/frame64/0.0.3";

const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache(),
});

export const getTournamentInfo = async (tournamentId: string) => {
  try {
    const tournamentQuery = `
      {
        tournaments(id: ${tournamentId} ) {
          compIDs
          compProviderAddress
          compURIs
          id
          resultProviderAddress
          tournamentAddress
          tournamentId
          tournamentURI
        }
      }
    `;

    const { data } = await client.query({
      query: gql(tournamentQuery),
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
