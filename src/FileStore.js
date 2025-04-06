class FileStore{

  /**
   *
   * @param file
   * @returns {Promise<{filename: string}>}
   */
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file); // Append the file to the FormData object

    const response = await fetch(`/api/files`, {
      method: 'POST',
      body: formData // Sending the form data as the body
    });

    if (response.ok) {
      return await response.json()

    } else {
      console.error("Failed to upload file!", response.status, response.text())
      throw Error("Failed to upload file!")
    }
  }

  getPathToFile(fileName){
    return `/api/files/${fileName}`
  }
}


export const fileStore =  new FileStore();
