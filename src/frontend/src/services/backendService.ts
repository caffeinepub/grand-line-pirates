import type { backendInterface } from "@/backend";

let _actor: backendInterface | null = null;

export function setBackendActor(actor: backendInterface) {
  _actor = actor;
}

function getActor(): backendInterface {
  if (!_actor) throw new Error("Backend actor not initialized");
  return _actor;
}

export const backend: backendInterface = new Proxy({} as backendInterface, {
  get(_target, prop: string) {
    return (...args: unknown[]) => {
      const actor = getActor();
      const method = (
        actor as unknown as Record<string, (...a: unknown[]) => unknown>
      )[prop];
      if (typeof method !== "function")
        throw new Error(`Method ${prop} not found`);
      return method.apply(actor, args);
    };
  },
});
