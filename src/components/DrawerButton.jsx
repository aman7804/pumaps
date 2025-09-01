import React from "react";
import { Button } from "@mui/material";

function DrawerButton({ iconPath, buttonName, onClick }) {
  return (
    <>
      <Button
        variant="outlined"
        sx={{ borderRadius: 28 }}
        startIcon={<img src={iconPath} alt="close" width={20} height={20} />}
        onClick={onClick}
      >
        {buttonName}
      </Button>
    </>
  );
}

export default DrawerButton;
