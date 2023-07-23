import {
  MsalProvider,
  AuthenticatedTemplate,
  useMsal,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import {
  InteractionRequiredAuthError,
  InteractionStatus,
} from "@azure/msal-browser";

import { useState, useEffect } from "react";

import { PageLayout } from "./components/PageLayout";
import { IdTokenData, AccessTokenData } from "./components/DataDisplay";

import { Buffer } from "buffer";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import "./styles/App.css";

function parseJWT(token) {
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
  const [accessTokenResponse, setAccessTokenResponse] = useState({});

  useEffect(() => {
    if (activeAccount && isLoading && inProgress === InteractionStatus.None) {
      const accessTokenRequest = {
        scopes: ["user.read"],
        account: activeAccount,
      };

      instance
        .acquireTokenSilent(accessTokenRequest)
        .then((accessTokenResponse) => {
          setAccessTokenResponse(accessTokenResponse);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance
              .acquireTokenRedirect(accessTokenRequest)
              .then((accessTokenResponse) => {
                setAccessTokenResponse(accessTokenResponse);
              })
              .catch((error) => {
                console.error(`Acquire token redirect failure: ${error}`);
              });
          }
          console.error(`Acquire token silent failure: ${error}`);
          setIsLoading(false);
        });
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
        {activeAccount && activeAccount.idToken ? (
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
              accessToken={accessTokenResponse.accessToken}
              accessTokenClaims={parseJWT(accessTokenResponse.accessToken)}
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
const App = ({ instance }) => {
  return (
    <MsalProvider instance={instance}>
      <PageLayout>
        <MainContent />
      </PageLayout>
    </MsalProvider>
  );
};

export default App;
