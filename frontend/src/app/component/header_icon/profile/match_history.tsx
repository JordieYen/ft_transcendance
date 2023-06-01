import React from 'react';
import formatDateMalaysia from '../../../utils/date';

function renderMatchRows(matches: any, userId: number, isP1: boolean) {
    return matches.map((match: any) => {
        const isWinner = userId === match?.winner_uid;
        const gameDate = formatDateMalaysia(new Date(match.date_of_creation));
        return (
            <tr key={match?.match_uid} className={isWinner ? 'row-win' : 'row-lose'}>
                <td className={isWinner ? 'result-win' : 'result-lose'}></td>
                <td>{ isP1 ? match?.p2_uid?.username : match?.p1_uid?.username } </td>
                <td>{ gameDate }</td>
                <td>{ isP1 ? match?.p1_score : match?.p2_score }</td>
                <td>{ isP1 ? match?.p2_score : match?.p1_score }</td>
            </tr>
        );
    });
}

const MatchHistory: React.FC<any> = ({ p1_match, p2_match, userId }) => {

    const p1MatchRows = p1_match.length ? renderMatchRows(p1_match, userId, true) : <tr><td colSpan={5}>No matches found</td></tr>;
    const p2MatchRows = p2_match.length ? renderMatchRows(p2_match, userId, false) : <tr><td colSpan={5}>No matches found</td></tr>;

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
                {p1MatchRows}
                {p2MatchRows}
            </tbody>
          </table>
        </div>
    );
}

export default MatchHistory;
