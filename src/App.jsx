// Import required dependencies
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

const App = () => {
  const [reports, setReports] = useState([]);
  const [user, setUser] = useState(null);
  const [totalFine, setTotalFine] = useState(0);
  const [filteredReports, setFilteredReports] = useState([]);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {

      try {
        const response = await axios.post("http://canteen.benzyinfotech.com/api/v3/customer/report", { "month": 11 }, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWRhNWExODU0OTFhYWE0MmY5YzMyZjRhMTU5MDM1ODk4ZjZiMzMxNWUzZjJjNGRiZDA1N2IyNGE3NTAzMDc3NDBlMjFlYjZmNGE4Mjk0MGUiLCJpYXQiOjE3MDQ4MDA4OTAuODc5OTI1OTY2MjYyODE3MzgyODEyNSwibmJmIjoxNzA0ODAwODkwLjg3OTkyOTA2NTcwNDM0NTcwMzEyNSwiZXhwIjoxNzM2NDIzMjkwLjgzNDkxMjA2MTY5MTI4NDE3OTY4NzUsInN1YiI6IjI2NSIsInNjb3BlcyI6W119.CwDEjlHoRtOXdFcaO6KGGxV202AOA7MMtJVPtKzgLqzTFzUUnDLGBd7PNAtHO2--3YOathM9HOG8hYjY8wjktXZIoCGUR9GWIaEVUxLwFq927CrSf05NuqTBTrJcDeBOjXDvKcSBiJ2A994FC2IunPcdkaZ4jpoaWBIaWueYUbHviYSQuLec3tFcAMg4njrImAlaN9k-QKkHetpdrdbUEX1Wzq4X-1QwuOx7W3W2nbbxaoNgFX1gaabxi00ZO7h5MokGvtqy_gCkS9TYoM74VfxmTyAAczjttLcPqDNiAL_ZJdutDMezw32CZj8G8l8PUL46F_BuaxatZDBUZxeClZh4_0Wvo9GX4zqF2XvHdzZHnwdB414vNCl8itaGW9w7QWbdchPOglhnek32ZmkH0MIqeOBhnAyHo5_WbP0uLd_3qmz3w04nvTbTGV25-QebaxPAsVD0-7Za1sVpqB_FD6yEeliaEzdxl_8gA5IH59uowpfPYgUIjom8NVEASuYsAwb0q3f0jhNRfwg2zmXNenoDunh_dN9l2NRjI2gdZueSMwu6IJLQK46jpn01uG2iQ1xx-pFJAGe_bzSceLsho3dbtabym3tMqi0Ac02xUP9Mn50LdkFJGNVU9jiuHQfyjQirDtGUfya3aIvpJlCGx9Cx99s_4P89uDnOiXy3A1Q`,
          },
        });
        if (response.status === 200) {
          const reports = response?.data?.reports || [];
          setReports(reports);
          setFilteredReports(reports);

          const fine = reports.reduce((acc, report) => {
            const { opt_ins } = report;
            if (opt_ins) {
              const pendingCount = Object.values(opt_ins).filter(
                (status) => status === "Pending"
              ).length;

              return acc + pendingCount * 100;
            }
            return acc;
          }, 0);

          setTotalFine(fine);
        }
        setUser(response?.data?.user);

      } catch (error) {
        console.error("Error fetching reports", error);
      }

    };

    fetchReports();
  }, []);
  const formattedFromDate = fromDate ? format(fromDate, 'yyyy-MM-dd') : null;
  const formattedToDate = toDate ? format(toDate, 'yyyy-MM-dd') : null;


  const handleFilter = () => {
    if (!fromDate || !toDate) {
      alert("Please select both From and To dates.");
      return;
    }
    const filtered = reports.filter((report) => {
      const reportDate = new Date(report.date);
      return reportDate >= new Date(fromDate) && reportDate <= new Date(toDate);
    });


    setFilteredReports(filtered);
    const fine = filtered.reduce((acc, report) => {
      const { opt_ins } = report;
      if (opt_ins) {
        const pendingCount = Object.values(opt_ins).filter(
          (status) => status === "Pending"
        ).length;
        return acc + pendingCount * 100;
      }
      return acc;
    }, 0);
    setTotalFine(fine);
  };
  const handleCheckReport = () => {
    if (!formattedFromDate || !formattedToDate) {
      alert("Please select both from date and to date to check the report.");
    } else {
      const reportUrl = `http://127.0.0.1:8010/app/query-report/Employee%20Food%20Order%20Details?from_date=${formattedFromDate}&to_date=${formattedToDate}`;
      window.open(reportUrl, "_blank");
    }
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mb: 4, mt: 5 }}>
          <Typography variant="h4" gutterBottom>
            Employee Food Order Details
          </Typography>
        </Box>
        {user && (
          <Box sx={{ mb: 4, p: 2, border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
            <Typography variant="body1">
              <strong>Employee Name:</strong> {user.f_name} {user.l_name}
            </Typography>
            <Typography variant="body1">
              <strong>Employee ID:</strong> {user.emp_id}
            </Typography>

          </Box>
        )}
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <DatePicker
            label="From Date"
            value={fromDate}
            onChange={(newValue) => setFromDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <DatePicker
            label="To Date"
            value={toDate}
            onChange={(newValue) => setToDate(newValue)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            sx={{ height: "56px" }}
          >
            Submit
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCheckReport}
            sx={{ height: "56px" }}
          >
            Check Report

          </Button>
        </Box>
        <Box sx={{ textAlign: 'center', p: 2, backgroundColor: '#f1f1f1', borderRadius: '8px' }}>
          <Typography variant="h5">
            Total Fine: Rs {totalFine || 0}
          </Typography>
        </Box>
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Breakfast</strong></TableCell>
                <TableCell><strong>Lunch</strong></TableCell>
                <TableCell><strong>Dinner</strong></TableCell>
                <TableCell><strong>Fine</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.map((report, index) => {
                const { date, opt_ins } = report;
                const fine = opt_ins
                  ? Object.values(opt_ins).filter((status) => status === "Pending").length *
                  100
                  : 0;

                return (
                  <TableRow key={index}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{opt_ins?.breakfast || "N/A"}</TableCell>
                    <TableCell>{opt_ins?.lunch || "N/A"}</TableCell>
                    <TableCell>{opt_ins?.dinner || "N/A"}</TableCell>
                    <TableCell>{fine}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </LocalizationProvider >
  );
};

export default App;


