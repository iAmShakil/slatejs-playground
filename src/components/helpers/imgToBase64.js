/**
 * Get base64 of a file
 *
 * @param {File} file the Image file
 * @returns {Promise} A promise that returns the base64 string on resolve
 * 
 */

const getBase64 = (file) => {
    const reader = new FileReader
    reader.readAsDataURL(file)
    reader.onload = () => {
      return reader.result
    }
    reader.onerror = (error) => {
      return error
    }
}

export default getBase64