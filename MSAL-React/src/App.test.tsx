import { waitFor } from "@testing-library/react";

import { PublicClientApplication } from "@azure/msal-browser";
import { render } from "react-dom";
import App from "./App";
import { msalConfig } from "../src/authConfig";

describe("Sanitize configuration object", () => {
  beforeAll(() => {});

  it("should define the config object", () => {
    expect(msalConfig).toBeDefined();
  });

  it("should not contain credentials", () => {
    const regexGuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(regexGuid.test(msalConfig.auth.clientId)).toBe(true);
  });

  it("should contain authority uri", () => {
    const regexUri =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    expect(regexUri.test(msalConfig.auth.authority)).toBe(true);
  });

  it("should not contain tenant id", () => {
    const regexGuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    expect(regexGuid.test(msalConfig.auth.authority.split(".com/")[1])).toBe(
      true
    );
  });

  it("should define a redirect uri", () => {
    expect(msalConfig.auth.redirectUri).toBeDefined();
  });
});

describe("Ensure that the app starts", () => {
  let instance: PublicClientApplication;
  let handleRedirectSpy: any;

  beforeEach(() => {
    global.crypto = require("crypto");
    instance = new PublicClientApplication(msalConfig);
    handleRedirectSpy = jest.spyOn(instance, "handleRedirectPromise");
  });

  it("should instantiate msal", () => {
    expect(instance).toBeDefined();
    expect(instance).toBeInstanceOf(PublicClientApplication);
  });

  it("should render the app without crashing", async () => {
    const div = document.createElement("div");

    render(<App instance={instance} />, div);

    await waitFor(() => expect(handleRedirectSpy).toHaveBeenCalledTimes(1));

    expect(div.textContent).toContain(
      "Welcome to the Microsoft Authentication Library For React Demo"
    );
  });
});
