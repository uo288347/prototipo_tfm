import { createContext, useContext, useReducer } from "react";
import { initTracking, finishTracking } from "@/metrics/scriptTest";

const ExperimentContext = createContext(null);

const initialState = {
  currentScene: null
};

function reducer(state, action) {
  switch (action.type) {
    case "START_SCENE": {
      if (state.currentScene !== null) {
        finishTracking(null);
      }
      initTracking(action.sceneId);
      return { currentScene: action.sceneId };
    }
    case "END_SCENE": {
      if (state.currentScene !== null) {
        finishTracking(null);
      }
      return { currentScene: null };
    }
    default:
      return state;
  }
}

export function ExperimentProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  return useContext(ExperimentContext);
}
