import {videoGameStore} from "./WrapperVideoGameStore.js";
import React, {useEffect, useState} from "react";
import {Server, ServerOff, Wifi, WifiOff} from "lucide-react";

function StoreSwitch() {
  const [mode, setMode] = useState(videoGameStore.mode);
  const [networkDown, setNetworkDown] = useState(false);
  const [serverDown, setServerDown] = useState(false);

  function handleModelChange(mode, reason) {
    setMode(mode);
    setServerDown(mode === 'local')
    if (mode === 'remote') {
      setNetworkDown(false)
    } else if (reason === 'ERR_NET') {
      setNetworkDown(true)
    }
  }

  useEffect(() => {
    videoGameStore.onModeChange = handleModelChange
    handleModelChange(videoGameStore.mode)
  })

  return (
    <>
      <div className="connection-status" title={mode}>
        {networkDown ?
          <WifiOff/> : <Wifi/>}
        {serverDown ?
          <ServerOff/> : <Server/>}

      </div>
    </>
  )
}

export default StoreSwitch
