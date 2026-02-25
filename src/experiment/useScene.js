import { useRef } from "react";
import { useExperiment } from "./ExperimentContext";

export function useScene(sceneId) {
  const { state, dispatch } = useExperiment();
  const startedRef = useRef(false);
  
  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (state.currentScene !== sceneId) {
      console.log(`[useScene] Starting scene tracking for Scene ID: ${sceneId}`);
      dispatch({ type: "START_SCENE", sceneId });
    }
  };

  const end = () => {
    if (!startedRef.current) return;
    startedRef.current = false;

    if (state.currentScene === sceneId) {
      console.log(`[useScene] Ending scene tracking for Scene ID: ${sceneId}`);
      dispatch({ type: "END_SCENE" });
    }
  };

  return {
    id: sceneId,
    start,
    end,
    active: state.currentScene === sceneId
  };
}
