import React from 'react';
import { useMutation, useQuery } from '@apollo/client'
import { QUERY_ROOMS } from '../utils/queries'

const Home = () => {

  const { loading, data } = useQuery(QUERY_ROOMS)
  
  const roomData = data?.rooms || {}

  console.log(roomData)

  return (
    <main>
      <div className="flex-row justify-center">
        Nothing here yet
      </div>
    </main>
  );
};

export default Home;
