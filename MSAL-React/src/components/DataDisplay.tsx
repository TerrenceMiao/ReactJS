import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { createClaimsTable } from "../utils/claimUtils";

import "../styles/App.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

type Claim = {
  claim: string;
  value: string;
  description: string;
};

function addRow(claim: string, value: string, description: string): Claim {
  return { claim, value, description };
}

export const IdTokenData = (props: any) => {
  console.log("Id Token: " + JSON.stringify(props.idToken));
  console.log("Id Token Claims: " + JSON.stringify(props.idTokenClaims));

  const tokenClaims = createClaimsTable(props.idTokenClaims);

  let rows: Claim[] = [];

  tokenClaims.forEach((row) => rows.push(addRow(row[0], row[1], row[2])));

  return (
    <>
      <Typography align="center" variant="h6">
        See below the claims in your <strong> ID token </strong>. For more
        information, visit:{" "}
      </Typography>
      <Link
        href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token"
        color="inherit"
        variant="h6"
      >
        https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens
      </Link>
      <br />
      <br />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Item>
            <Typography align="left" variant="body1">
              <span className="fixedSpan">{props.idToken}</span>
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Claim</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.claim}>
                <StyledTableCell component="th" scope="row">
                  {row.claim}
                </StyledTableCell>
                <StyledTableCell>{row.value}</StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export const AccessTokenData = (props: any) => {
  console.log("Access Token: " + JSON.stringify(props.accessToken));
  console.log(
    "Access Token Claims: " + JSON.stringify(props.accessTokenClaims)
  );

  const tokenClaims = createClaimsTable(props.accessTokenClaims);

  const rows: Claim[] = [];

  tokenClaims.forEach((row) => rows.push(addRow(row[0], row[1], row[2])));

  return (
    <>
      <Typography align="center" variant="h6">
        See below is your <strong> Access token </strong>. For more information,
        visit:{" "}
      </Typography>
      <Link
        href="https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens"
        color="inherit"
        variant="h6"
      >
        https://docs.microsoft.com/en-us/azure/active-directory/develop/access-tokens
      </Link>
      <br />
      <br />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Item>
            <Typography align="left" variant="body1">
              <span className="fixedSpan">{props.accessToken}</span>
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Claim</StyledTableCell>
              <StyledTableCell>Value</StyledTableCell>
              <StyledTableCell>Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.claim}>
                <StyledTableCell component="th" scope="row">
                  {row.claim}
                </StyledTableCell>
                <StyledTableCell>{row.value}</StyledTableCell>
                <StyledTableCell>{row.description}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
