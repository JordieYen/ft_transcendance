const MatchMaking = ( { stat } : {stat: any }) => {
  const kdr = (stat?.kills / stat?.deaths).toFixed(2);
    
  return (
    <div className='match-making'>
        <div className='circle-top'>
          <div className='circle-content'>
              <p>MATCH MAKING ON<br/><span>{stat?.current_mmr}</span><br/>{stat?.best_mmr}</p>
          </div>
        </div>
        <div className='circle-bottom'>
          <div className='circle-content'>
           <p>LIFETIME KILLS<br/><span>{stat?.kills}</span><br/>DEATHS {stat?.deaths}<br/>K/DR {kdr}</p>
          </div>
        </div>
        <div className='stats'>
          <p>Smash Count <span>{stat?.smashes}</span></p>
          <hr />
          {/* <p>Lights Out Count <span>5</span></p> */}
        </div>
     </div>
  );
}


export default MatchMaking;
