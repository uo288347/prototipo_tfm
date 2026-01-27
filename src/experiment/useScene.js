import { useExperiment } from "./ExperimentContext";
import { useRef } from "react";

export function useScene(sceneId) {
  const { state, dispatch } = useExperiment();
  const startedRef = useRef(false);
  
  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    if (state.currentScene !== sceneId) {
      dispatch({ type: "START_SCENE", sceneId });
    }
  };

  const end = () => {
    if (!startedRef.current) return;
    startedRef.current = false;

    if (state.currentScene === sceneId) {
      dispatch({ type: "END_SCENE" });
    }
  };

  return {
    start,
    end,
    active: state.currentScene === sceneId
  };
}
