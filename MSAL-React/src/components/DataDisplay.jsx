import * as React from "react";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { createClaimsTable } from "../utils/claimUtils";

import "../styles/App.css";

function addRow(claim, value, description) {
  return { claim, value, description };
}

export const IdTokenData = (props) => {
  const tokenClaims = createClaimsTable(props.idTokenClaims);

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

  const rows = [];

  Object.keys(tokenClaims).map((key, index) => {
    let row = [];
    tokenClaims[key].map((claimItem) => row.push(claimItem));
    rows.push(addRow(row[0], row[1], row[2]));
    return null;
  });

  return (
    <>
      {/* <div className="data-area-div"> */}
        <Typography align="center" variant="h6">
          See below the claims in your <strong> ID token </strong>. For more
          information, visit:{" "}
        </Typography>
        <Link
          href="https://docs.microsoft.com/en-us/azure/active-directory/develop/id-tokens#claims-in-an-id-token"
          color="inherit"
          variant="h6"
        >
          docs.microsoft.com
        </Link>
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
                  <StyledTableCell>
                    {row.description}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      {/* </div> */}
    </>
  );
};
