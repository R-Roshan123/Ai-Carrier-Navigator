import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../services/careerApi';

// Loads data from `loader` whenever `deps` change. Keeps the previous data
// while reloading so the page does not flash back to a loading state.
export default function useApiData(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const [reloadKey, setReloadKey] = useState(0);
  const loaderRef = useRef(loader);
  // Declared before the loading effect so it always sees the latest loader
  useEffect(() => {
    loaderRef.current = loader;
  });

  useEffect(() => {
    let active = true;
    setState((current) => ({ ...current, loading: true, error: '' }));
    loaderRef
      .current()
      .then((data) => {
        if (active) setState({ data, loading: false, error: '' });
      })
      .catch((error) => {
        if (active) setState((current) => ({ ...current, loading: false, error: getErrorMessage(error) }));
      });
    return () => {
      active = false;
    };
  }, [...deps, reloadKey]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  const setData = useCallback(
    (updater) => setState((current) => ({ ...current, data: typeof updater === 'function' ? updater(current.data) : updater })),
    [],
  );

  return { ...state, reload, setData };
}
