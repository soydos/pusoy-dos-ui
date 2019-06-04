import React, { useState } from 'react';
import Game from "../game/Game";

const Multiplayer = ({inGameCache}) => {

    return (
      <>
        <Game store={inGameCache} />
        <p>We've not actually implemented multiplayer yet...
          sorry!</p>
      </>
    )
};

export default Multiplayer;
