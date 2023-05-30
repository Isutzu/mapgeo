import * as React from "react";
import dayjs from "dayjs";
import LocalShipping from "@mui/icons-material/LocalShipping";
import CssBaseline from "@mui/material/CssBaseline";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Button,
  Container,
  Stack,
  Typography,
  Box,
} from "@mui/material";

import Map from "@mui/icons-material/Map";
import InputAdornment from "@mui/material/InputAdornment";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/es";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

export default function FechaPlacaMui() {
  return (
    <LocalizationProvider
      //localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
      dateAdapter={AdapterDayjs}
      adapterLocale="es"
    >
      <Container component="main" maxWidth="xs">
        {/* <CssBaseline /> */}

        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" component="h1" align="center">
            Flota Vehiculos
          </Typography>

          <TextField
            margin="normal"
            label="placa"
            variant="outlined"
            color="primary"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <LocalShipping />
                </InputAdornment>
              ),
            }}
            required
            sx={{ mb: 2 }}
          />
          <DatePicker
            //defaultValue={dayjs()}
            label="fecha"
            color="primary"
            required
            sx={{ mb: 2 }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            startIcon={<Map />}
            sx={{ mt: 3, mb: 2, p: 1.5 }}
          >
            Mostrar Ruta
          </Button>

          <Button
            variant="outlined"
            startIcon={<Map />}
            sx={{ mb: 2, p: 1.5}}
           // onClick={mostrarTodasLasRutas}
          >
            Mostrar Flota
           
          </Button>
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
