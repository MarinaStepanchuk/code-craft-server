import ApiError from '../utils/api-error.js';
import { errorsObject } from '../utils/constants.js';
import { ref, getDownloadURL, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { storage } from '../app.js';

export default class FirebaseService {
  static async saveFile(file) {
    try {
      const dateTime = new Date().getTime();
      const storageRef  = ref(storage, `images/${file.originalname}${dateTime}`);
      const metadata = {
        contentType: file.mimetype,
      }
      const snapshot = await uploadBytesResumable(storageRef, file.buffer, metadata)
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      throw ApiError.LoadingError(errorsObject.failedLoadImage);
    }
  }

  static async removeImage(image) {
    try {
      const desertRef = ref(storage, `images/${image}`);
      if(desertRef) deleteObject(desertRef);
    } catch(error) {
      console.log(error)
    }
  }
}