import { useExperiment } from "./ExperimentContext";

export function useScene(sceneId) {
  const { state, dispatch } = useExperiment();

  const start = () => {
    if (state.currentScene !== sceneId) {
      dispatch({ type: "START_SCENE", sceneId });
    }
  };

  const end = () => {
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
