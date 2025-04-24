import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
  Container,
  Paper,
  useMediaQuery,
  CircularProgress,
  Box,
} from "@mui/material";

export default function VoteChart({ votes }) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  if (!Array.isArray(votes) || votes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  const formattedVotes = votes.map((v) => ({
    candidate: {
      name: `${v.candidate?.firstName || "Unknown"} ${
        v.candidate?.lastName || ""
      }`,
    },
    votes: v.totalVotes || 0,
  }));

  return (
    <Container
      sx={{
        marginTop: "-20px",
        marginBottom: "20px",
        padding: "5px",
        height: 250,
      }}
      component={Paper}
    >
      <h6 style={{ marginTop: "5px", marginLeft: "10px" }}>
        📊 Vote Statistics
      </h6>
      <BarChart
        height={isSmallScreen ? 100 : 200}
        width={isSmallScreen ? 200 : 800}
        series={[
          {
            data: formattedVotes.map((v) => v.votes),
            label: "Total Votes",
            id: "votesId",
            yAxisId: "leftAxisId",
          },
        ]}
        xAxis={[
          {
            data: formattedVotes.map((v) => v.candidate.name),
            scaleType: "band",
          },
        ]}
        yAxis={[
          {
            id: "leftAxisId",
            width: 50,
          },
        ]}
      />
    </Container>
  );
}
