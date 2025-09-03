import * as React from "react";
import { Typography, Stack, Box } from "@mui/material";
import DrawerButton from "./DrawerButton";
import DrawerPhotos from "./DrawerPhotos";

export default function LocationInfo({
  currentMarkerData,
  handleDirectionClick,
  handleStartClick,
}) {
  const renderTwoColumnInfo = () => {
    const possibleFields = [
      "time",
      "pricing",
      "category",
      "specialty",
      "contact",
    ];
    const infoEntries = possibleFields
      .filter((key) => currentMarkerData[key]) // only include existing and non-empty fields
      .map((key) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        value: currentMarkerData[key],
      }));

    const mid = Math.ceil(infoEntries.length / 2);
    const firstCol = infoEntries.slice(0, mid);
    const secondCol = infoEntries.slice(mid);

    return (
      <>
        <Stack spacing={0.5}>
          {firstCol.map((item) => (
            <Typography key={item.label} variant="body2">
              <strong>{item.label}:</strong> {item.value}
            </Typography>
          ))}
        </Stack>
        <Stack spacing={0.5}>
          {secondCol.map((item) => (
            <Typography key={item.label} variant="body2">
              <strong>{item.label}:</strong> {item.value}
            </Typography>
          ))}
        </Stack>
      </>
    );
  };
  return (
    <>
      {currentMarkerData && (
        <>
          {/* Buttons */}
          <Stack direction="row" px={2} py={1} spacing={2}>
            <DrawerButton
              iconPath="assets/direction.svg"
              buttonName="Directions"
              onClick={handleDirectionClick}
            />
            <DrawerButton
              iconPath="assets/navigation.svg"
              buttonName="Start"
              onClick={handleStartClick}
            />
          </Stack>

          {/* Info Table */}
          <Stack direction="row" px={2} py={1} spacing={2}>
            {renderTwoColumnInfo(currentMarkerData)}
          </Stack>

          {/* Description Section */}
          {currentMarkerData.description && (
            <Box px={2} py={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentMarkerData.description}
              </Typography>
            </Box>
          )}

          {/* Photos */}
          <DrawerPhotos />
        </>
      )}
    </>
  );
}
