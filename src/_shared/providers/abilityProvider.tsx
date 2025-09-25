import { AbilityContext } from "../lib/casl";
import { useAuthStore } from "../stores/auth.store";

export function AbilityProvider({ children }: { children: React.ReactNode }) {
  const ability = useAuthStore((state) => state.ability);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
}