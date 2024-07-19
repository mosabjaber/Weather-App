import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";

import axios from "axios";

import { useEffect, useState } from "react";
// get date
import moment from "moment";
//translate library inext18
import { useTranslation } from "react-i18next";

// start font family
const theme = createTheme({
  typography: {
    fontFamily: ["IBM"],
  },
});
// end font family
let cancelAxios = null;
function App() {
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  const [dataAndTime, setDataAndTime] = useState("");
  const { t, i18n } = useTranslation();
  const [locale, setLocale] = useState("ar");
  useEffect(() => {
    setDataAndTime(moment().format("MMMM Do dddd"));
    // start translate
    i18n.changeLanguage(locale);
    // end translate
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=31.963158&lon=35.930359&appid=bacec4b64be372089046bc0d60abaa72",
        // start cleanup useeffect
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
        // end cleanup useeffect
      )
      .then(function (response) {
        const mainTemp = Math.round(response.data.main.temp - 272.15);
        const minTemp = Math.round(response.data.main.temp_min - 272.15);
        const maxTemp = Math.round(response.data.main.temp_max - 272.15);
        const descriptionTemp = response.data.weather[0].description;
        const iconTemp = response.data.weather[0].icon;

        setTemp({
          number: mainTemp,
          description: descriptionTemp,
          min: minTemp,
          max: maxTemp,
          icon: `https://openweathermap.org/img/wn/${iconTemp}@2x.png`,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    // return clean up
    return () => {
      cancelAxios();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLangClick() {
    if (locale == "en") {
      setLocale("ar");
      i18n.changeLanguage("ar");
    } else {
      setLocale("en");
      i18n.changeLanguage("en");
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="card" dir={locale == "en" ? "ltr" : "rtl"}>
            <div className="content">
              <div
                style={{
                  display: "flex",
                  alignItems: "end",
                  justifyContent: "start",
                }}
                dir={locale == "en" ? "ltr" : "rtl"}
              >
                <Typography
                  variant="h2"
                  style={{
                    margin: "0px 20px",
                    fontWeight: "600",
                  }}
                >
                  {t("Amman")}{" "}
                </Typography>
                <Typography variant="h5" style={{ marginRight: "20px" }}>
                  {dataAndTime}
                </Typography>
              </div>
              <hr />
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                  <div
                    className="temp"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h1" style={{ textAlign: "right" }}>
                      {temp.number}
                    </Typography>
                    <img src={temp.icon} />
                  </div>
                  <Typography variant="h6"> {t(temp.description)}</Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h5>
                      {t("min")}: {temp.min}
                    </h5>
                    <h3>|</h3>
                    <h5>
                      {t("max")}: {temp.max}
                    </h5>
                  </div>
                </div>
                <CloudIcon style={{ fontSize: "200px" }}></CloudIcon>
              </div>
            </div>
          </div>
          {/* start translate button */}
          <Button
            style={{ color: "white", margin: "20px" }}
            variant="text"
            onClick={handleLangClick}
          >
            {locale == "en" ? "عربي" : "english"}
          </Button>
          {/* end translate button */}
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default App;
