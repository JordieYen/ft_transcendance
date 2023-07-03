import React from 'react';
import formatDateMalaysia from '../../utils/formatDateMalaysia';

function renderMatchRows(matches: any, userId: number) {
  return matches.map((match: any) => {
    const isWinner = userId === match?.winner_uid;
    const gameDate = formatDateMalaysia(new Date(match.date_of_creation));

    // Determine the opponent username based on whether the current user is player 1 or player 2
    const opponentUsername = userId === match?.p1?.id ? match?.p2?.username : match?.p1?.username;
    const playerScore = userId === match?.p1?.id ? match?.p1_score : match?.p2_score;
    const opponentScore = userId === match?.p1?.id ? match?.p2_score : match?.p1_score;

    return (
      <tr key={match?.match_uid} className={isWinner ? 'row-win' : 'row-lose'}>
        <td className={isWinner ? 'result-win' : 'result-lose'}></td>
        <td>{opponentUsername}</td>
        <td>{gameDate}</td>
        <td>{playerScore}</td>
        <td>{opponentScore}</td>
      </tr>
    );
  });
}


const MatchHistory: React.FC<any> = ({ p1_match, p2_match, userId }) => {

    const combinedMatches = [ ...p1_match, ...p2_match ];
    combinedMatches.sort((a, b) => {
        return new Date(b.date_of_creation).getTime() - new Date(a.date_of_creation).getTime();
    });
    const matchRow = combinedMatches.length ? (
      <>
        {renderMatchRows(combinedMatches, userId)}
      </>
    ) : (
      <tr>
        <td colSpan={5}>No matches found</td>
      </tr>
    );

    return (
        <div className='match-history'>
          <table>
            <thead>
              <tr>
                <th style={{ width: '5.0%' }}></th>
                <th>Opponent</th>
                <th>Date</th>
                <th>Player Stat</th>
                <th>Opponent Stat</th>
              </tr>
            </thead>
            <tbody>
                <tr className='spacer'></tr>
                {/* {p1MatchRows}
                {p2MatchRows} */}
                { matchRow }
            </tbody>
          </table>
        </div>
    );
}

export default MatchHistory;
