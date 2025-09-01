import React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import IconButton from "@mui/material/IconButton";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box } from "@mui/material";

// import itemData from "./itemData";

export default function DrawerPhotos() {
  // Example item data with one image per item
  const itemData = [
    {
      img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
      title: "Breakfast",
    },
    {
      img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
      title: "Burger",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
  ];

  return (
    <ImageList
      // sx={{
      //   flexWrap: "nowrap", // horizontal
      //   transform: "translateZ(0)", // perf boost
      //   overflowX: "auto",
      //   scrollbarWidth: "none", // hide scrollbar (Firefox)
      //   "&::-webkit-scrollbar": { display: "none" }, // hide scrollbar (Chrome/Safari)
      //   width: 500,
      //   gap: 8,
      //   height: 250,
      // }}
      sx={{
        display: "flex",
        overflowX: "auto",
        gap: 1,
        p: 1,
        scrollbarWidth: "none", // Firefox
        "&::-webkit-scrollbar": { display: "none" }, // Chrome/Safari
      }}
      cols={2.5} // show ~2.5 items at once
      gap={2}
    >
      {itemData.map((item) => (
        // <ImageListItem key={item.img}>
        //   <img
        //     src={`${item.img}?w=248&fit=crop&auto=format`}
        //     srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
        //     alt={item.title}
        //     loading="lazy"
        //   />
        // </ImageListItem>
        <Box
          key={item.img}
          component="img"
          src={`${item.img}?w=248&fit=crop&auto=format`}
          alt={item.title}
          loading="lazy"
          sx={{
            flex: "0 0 auto", // prevent shrinking
            width: 200,
            height: 200,
            borderRadius: 2,
            objectFit: "cover",
          }}
        />
      ))}
    </ImageList>
  );
}
