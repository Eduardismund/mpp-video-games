const dictionary = {
  en:
    {
      navMenu: {
        "home": {
          shortTitle: "Home",
          title: "Home"
        },
        "add-video-game": {
          shortTitle: "Add video game",
          title: "Add a Video Game to the Library",
          description: `When a user clicks "Add", the system checks availability and updates the cart. If the game is already in the cart, we adjust the quantity.`,
          actionLabel: "Add"
        },
        "update-video-game": {
          shortTitle: "Update video game",
          title: "Update a Video Game",
          description: `When a user clicks "update", the system check availability and updates the cart.`,
          actionLabel: "Update"
        },
        "list-video-games": {
          shortTitle: "List video games",
          title: "List All Video Games From Library",
          description: `When a user clicks "list", the system shows all the games from the library.`,
          actionLabel: "List"
        },
        "delete-video-game": {
          shortTitle: "Delete video game",
          title: "Delete video game from Library",
          description: `When a user clicks "Delete", the system shows deletes the given game`,
          actionLabel: "Delete"
        }
      },
      videoGameFields: {
        name: {shortName: "Name", inputName: "Insert the name of the video game"},
        genre: {shortName: "Genre", inputName: "Insert the name of the genre"},
        releaseDate: {shortName: "Release Date", inputName: "Insert the release date: (YYYY-MM-DD)"},
        price: {shortName: "Price", inputName: "Insert the price of the game"}
      }
    }
}


export function getDictionary(lang) {
  return dictionary[lang]
}
