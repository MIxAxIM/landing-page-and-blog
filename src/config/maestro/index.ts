import { MaestroProvider } from "@meshsdk/core";
import { MaestroClient, Configuration } from "@maestro-org/typescript-sdk";

export const maestro_key = "292hClTTejbQtFZmxUk5y4LoWjxirYWl"

const maestro = new MaestroProvider({
  network: "Preprod",
  apiKey: maestro_key,
  turboSubmit: false,
});

export default maestro;

const maestroClient = new MaestroClient(
  new Configuration({
    apiKey: maestro_key,
    network: "Preprod",
  }),
);

export { maestroClient };

