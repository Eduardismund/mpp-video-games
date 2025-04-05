import {videoGameStore} from "./WrapperVideoGameStore.js";
import {useState} from "react";

function StoreSwitch() {

  const [mode, setMode] = useState(videoGameStore.mode)
  videoGameStore.onModeChange = () => {
    setMode(videoGameStore.mode)
  }

  async function handleSwitch() {
    if (mode === 'local') {
      await videoGameStore.switchToRemote()
    } else {
      await videoGameStore.switchToLocal()
    }
  }

  return (
    <>
      <button onClick={handleSwitch}>{mode}</button>
    </>
  )
}

export default StoreSwitch
