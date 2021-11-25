// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect } from "react";
import appApiClient from "../../api/appApiClient";
import { TelemetryItemProps, ResponseTelemetryDataProps } from "../../types";
import "../../App.css";
import { Rnd } from "react-rnd";
import Container from "../../components/container";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";

const Home = () => {
  const [telemetryData, setTelemetryData] = useState<TelemetryItemProps>([]);
  const fetchData = async () => {
    try {
      const response = await appApiClient.get<ResponseTelemetryDataProps>("/");
      setTelemetryData(response.data.telemetryData);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const initialValue = [{
    humidityHeight: 0.5,
  }];

  // panel form value
  const [values, setValues] = useState(initialValue);

  const style = {
    display: "flex",
    // alignItems: "center",
    // justifyContent: "center",
    border: "solid 2px #ddd",
    background: "#f0f0f0",
    zIndex: 2,
    borderRadius: "10px",
    minWidth: 300,
    minHeight: 300,
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  useEffect(() => {
    localStorage.setItem("humidityHeight", values[0].humidityHeight);
  }, [values])

  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <div className="dragZone" style={{ width: "100vw", height: "100vh" }}>
        <Box align="right">
          <Button
            m="4"
            size="xs"
            onClick={toggle}
            sx={{ zIndex: 2 }}
            borderRadius="25px"
          >
            {isOpen ? "Close Panel" : "Open Panel"}
          </Button>
        </Box>

        {/* floating panel */}

        {JSON.stringify(values)}

        {isOpen && (
          <Rnd
            style={style}
            default={{
              x: Math.floor(Math.random() * window.innerWidth) / 2,
              y: Math.floor(Math.random() * window.innerHeight) / 2,
              width: window.innerWidth / 4,
              height: window.innerHeight / 4,
            }}
            minWidth={300}
            minHeight={300}
            maxHeight={window.innerHeight / 3}
            maxWidth={window.innerWidth / 3}
            bounds={".dragZone"}
          >
            <Box w="100%">
              <Tabs size="sm">
                <TabList>
                  <Tab>Device Data</Tab>
                  <Tab>Mockup Data</Tab>
                  <Tab>About</Tab>
                </TabList>
                <TabPanels>
                  {/* current data */}
                  <TabPanel>
                    {telemetryData.map(
                      (telemetryItem: TelemetryItemProps, index, array) =>
                        array.length - 1 === index && (
                          <div key={index}>
                            <div>
                              date:{" "}
                              {telemetryItem.EventEnqueuedUtcTime.substring(
                                0,
                                10
                              )}
                            </div>
                            <div>
                              time:{" "}
                              {telemetryItem.EventEnqueuedUtcTime.substring(
                                11,
                                19
                              )}
                            </div>
                            <div>sitting time: {telemetryItem.sittingTime}</div>
                            <div>temperature: {telemetryItem.temperature}</div>
                            <div>humidity: {telemetryItem.humidity}</div>
                            <div>
                              dust concentration:{" "}
                              {telemetryItem.dustConcentration}
                            </div>
                            <br />
                          </div>
                        )
                    )}
                  </TabPanel>
                  <TabPanel>
                    <p>some mock up data</p>
                    <Slider
                      aria-label="slider-ex-1"
                      defaultValue={30}
                      onChange={(value) => {
                        setValues([{ humidityHeight: value / 100 }]);
                      }}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </TabPanel>
                  <TabPanel>
                    <p>okja is cute dog</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Rnd>
        )}

        {/* floating panel end*/}

        <Container />
      </div>
    </div >
  );
};

export default Home;
