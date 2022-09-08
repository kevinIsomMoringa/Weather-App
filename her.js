const artistInfo = {
    name: "Talking Heads",
    genre: "New Wave",
    origin: "New York City",
    members: [
      {
        firstName: "David",
        lastName: "Byrne",
        instruments: {
          main: "Vocals",
          secondary: "Guitar",
        },
      },
      {
        firstName: "Chris",
        lastName: "Frantz",
        instruments: {
          main: "Drums",
        },
      },
      {
        firstName: "Tina",
        lastName: "Weymouth",
        instruments: {
          main: "Bass",
        },
      },
      {
        firstName: "Jerry",
        lastName: "Harrison",
        instruments: {
          main: "Keyboards",
          secondary: "Guitar",
        },
      },
    ],
  };
  
  console.log(artistInfo.members[0].instruments);
  // => { main: "Vocals", secondary: "Guitar" }