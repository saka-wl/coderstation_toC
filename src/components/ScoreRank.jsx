import { useState, useEffect } from 'react';
import { getUserByPointsRank } from '../api/user';
import ScoreItem from "./ScoreItem";
import { Card } from "antd";

function ScoreRank(props) {

  const [userRankInfo, setUserRankInfo] = useState([])

  useEffect(() => {
    async function fetchUser() {
      const {data} = await getUserByPointsRank()
      setUserRankInfo(data)
    }
    fetchUser()
  }, [])

  const userPointsRankArr = [];
  if(userRankInfo.length){
      for(let i=0;i<userRankInfo.length;i++){
          userPointsRankArr.push(
              <ScoreItem 
                  rankInfo={userRankInfo[i]}
                  rank={i+1}
                  key={userRankInfo[i]._id}
              />
          )
      }
  }

  return (
      <Card title="积分排行榜" style={{
        marginTop: "30px"
      }}>
          {userPointsRankArr}
      </Card>
  );
}

export default ScoreRank;