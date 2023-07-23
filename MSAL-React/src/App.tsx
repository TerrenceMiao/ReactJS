import {
  AuthenticationResult,
  IPublicClientApplication,
  InteractionStatus,
} from "@azure/msal-browser";
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from "@azure/msal-react";

import { useEffect, useState } from "react";

import { AccessTokenData, IdTokenData } from "./components/DataDisplay";
import { PageLayout } from "./components/PageLayout";

import { Buffer } from "buffer";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import "./styles/App.css";

function parseJWT(token: string): unknown {
  return token
    ? JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    : null;
}

const MainContent = () => {
  /**
   * useMsal is a hook that returns the PublicClientApplication instance.
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/hooks.md
   */
  const { instance, inProgress } = useMsal();
  const activeAccount = instance.getActiveAccount();

  const [isLoading, setIsLoading] = useState(true);
  const [response, setResponse] = useState<AuthenticationResult>();

  useEffect(() => {
    if (activeAccount && isLoading && inProgress === InteractionStatus.None) {
      instance
        .acquireTokenSilent({
          scopes: ["user.read"],
          account: activeAccount,
        })
        .then((response) => {
          setResponse(response);
        })
        .catch((error) => {
          console.error(
            "Acquire token silent failure: " + JSON.stringify(error)
          );
        });
      setIsLoading(false);
    }
  }, [instance, inProgress, activeAccount, isLoading]);

  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively. For more, visit:
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
   */
  return (
    <div className="App">
      <AuthenticatedTemplate>
        {activeAccount && activeAccount.idToken && response?.accessToken ? (
          <Container>
            <IdTokenData
              idToken={activeAccount.idToken}
              idTokenClaims={activeAccount.idTokenClaims}
            />
            <br />
            <br />
            <br />
            <br />
            <AccessTokenData
              accessToken={response.accessToken}
              accessTokenClaims={parseJWT(response.accessToken)}
            />
          </Container>
        ) : null}
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Typography variant="h5">
          Please sign-in to see your profile information.
        </Typography>
      </UnauthenticatedTemplate>
    </div>
  );
};

/**
 * msal-react is built on the React context API and all parts of your app that require authentication must be
 * wrapped in the MsalProvider component. You will first need to initialize an instance of PublicClientApplication
 * then pass this to MsalProvider as a prop. All components underneath MsalProvider will have access to the
 * PublicClientApplication instance via context as well as all hooks and components provided by msal-react. For more, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/getting-started.md
 */

type AppProps = {
  instance: IPublicClientApplication;
};

function App({ instance }: AppProps) {
  return (
    <MsalProvider instance={instance}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </MsalProvider>
  );
}

export default App;
