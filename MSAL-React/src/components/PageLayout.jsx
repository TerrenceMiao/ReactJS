import { AuthenticatedTemplate } from "@azure/msal-react";

import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { NavigationBar } from "./NavigationBar.jsx";

export const PageLayout = (props) => {
  /**
   * Most applications will need to conditionally render certain components based on whether a user is signed in or not.
   * msal-react provides 2 easy ways to do this. AuthenticatedTemplate and UnauthenticatedTemplate components will
   * only render their children if a user is authenticated or unauthenticated, respectively.
   */
  return (
    <>
      <NavigationBar />
      <br />
      <br />
      <br />
      <br />
      <Typography align="center" variant="h5">
        Welcome to the Microsoft Authentication Library For React Demo
      </Typography>
      <br />
      {props.children}
      <br />
      <AuthenticatedTemplate>
        <center>
          <br />
          <br />
          <br />
          <Typography align="center" variant="h5">
            How did we do?
          </Typography>
          <Link
            href="https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR73pcsbpbxNJuZCMKN0lURpUMlRHSkc5U1NLUkxFNEtVN0dEOTFNQkdTWiQlQCN0PWcu"
            color="inherit"
            variant="h6"
          >
            Share your experience!
          </Link>
          <br />
          <br />
        </center>
      </AuthenticatedTemplate>
    </>
  );
};
