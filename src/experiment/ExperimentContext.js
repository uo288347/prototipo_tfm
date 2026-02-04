import { finishTracking, initTracking } from "@/metrics/scriptTest";
import { createContext, useContext, useEffect, useReducer, useRef } from "react";

const ExperimentContext = createContext(null);

const initialState = {
  currentScene: null
};

function reducer(state, action) {
  switch (action.type) {
    case "START_SCENE": {
      return { currentScene: action.sceneId };
    }
    case "END_SCENE": {
      return { currentScene: null };
    }
    default:
      return state;
  }
}

export function ExperimentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const previousSceneRef = useRef(null);

  useEffect(() => {
    const prev = previousSceneRef.current;
    const curr = state.currentScene;

    if (prev !== null && prev !== curr) {
      console.log(`[ExperimentContext] Ending tracking for Scene ID: ${prev}`);
      finishTracking(null);
    }

    if (curr !== null && prev !== curr) {
      console.log(`[ExperimentContext] Starting tracking for Scene ID: ${curr}`);
      initTracking(curr);
    }

    previousSceneRef.current = curr;
  }, [state.currentScene]);

  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  return useContext(ExperimentContext);
}
