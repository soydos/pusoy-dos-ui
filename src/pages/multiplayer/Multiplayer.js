import React, { useState } from 'react';
import Game from "../game/Game";

const Multiplayer = ({inGameCache}) => {

    return (
      <>
        <Game store={inGameCache} />
      </>
    )
};

export default Multiplayer;
