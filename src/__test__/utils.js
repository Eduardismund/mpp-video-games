export function generateRandomVideoGame() {
  // Helper function to generate random dates in the format 'yyyy-mm-dd'
  function generateRandomDate() {
    const startDate = new Date(2000, 0, 1); // Starting date: Jan 1, 2000
    const endDate = new Date(); // Today's date
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate - startDate));

    const year = randomDate.getFullYear();
    const month = String(randomDate.getMonth() + 1).padStart(2, '0');
    const day = String(randomDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  // Helper function to generate a random price between 10 and 500
  function generateRandomPrice() {
    return (Math.random() * (10000 - 10) + 10).toFixed(2);
  }

  // Helper function to generate random strings
  function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  return {
    name: generateRandomString(10),          // Random name (string of 10 characters)
    genre: generateRandomString(50),   // Random description (string of 50 characters)
    releaseDate: generateRandomDate(),       // Random release date (yyyy-mm-dd)
    price: Number(generateRandomPrice()),            // Random price (between 10 and 500)
  };
}
