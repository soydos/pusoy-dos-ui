import React, { useState } from 'react';
import Game from "../game/Game";

const Multiplayer = ({inGameCache}) => {

    return (
      <>
        <p>We've not actually implemented multiplayer yet...
          sorry!</p>

        <Game store={inGameCache} />
      </>
    )
};

export default Multiplayer;
