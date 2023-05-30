import React from 'react';
import formatDateMalaysia from '../utils/date';

function renderMatchRows(matches: any, userId: number, isP1: boolean) {
    return matches.map((match: any) => {
        const isWinner = userId === match?.winner_uid;
        // const gameDate = new Date(match?.data_of_creation).toLocaleDateString(undefined, {
        //     day: 'numeric',
        //     month: 'long',
        //     year: 'numeric',
        // });

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

    const p1MatchRows = renderMatchRows(p1_match, userId, true);
    const p2MatchRows = renderMatchRows(p2_match, userId, false);

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
              {/* <tr className='spacer'></tr>
                { p1_match.map((match: any) => (
                    <tr key={match?.match_uid} className='row-win'>
                        <td className='result-win'></td>
                        <td>{ match?.p2_uid?.username }</td>
                        <td>{ new Date(match?.date_of_creation)?.toLocaleDateString()}</td>
                        <td>{ match?.p1_score }</td>
                        <td>{ match?.p2_score }</td>
                    </tr>
                ))}
                { p2_match.map((match: any) => (
                    <tr key={match?.match_uid} className='row-lose'>
                        <td className='result-lose'></td>
                        <td>{ match?.p1_uid?.username }</td>
                        <td>{ new Date(match?.date_of_creation)?.toLocaleDateString()}</td>
                        <td>{ match?.p2_score }</td>
                        <td>{ match?.p1_score }</td>
                    </tr>
                ))} */}
                {p1MatchRows}
                {p2MatchRows}
            </tbody>
          </table>
        </div>
    );
}

export default MatchHistory;
