import * as api from "./api";

/**
 * Load all user data from the API after authentication and dispatch
 * it into the store. Call this after login or session restore.
 */
export async function loadUserData(dispatch: Function) {
  try {
    const family = await api.getFamily();
    if (!family) return; // No family yet

    const [children, destinations, alerts] = await Promise.all([
      api.getChildren(family.id),
      api.getDestinations(family.id),
      api.getAlerts(),
    ]);

    dispatch({
      type: 'LOAD_API_DATA',
      payload: { family, children, destinations, alerts },
    });
  } catch (err) {
    console.error("Failed to load user data:", err);
  }
}
