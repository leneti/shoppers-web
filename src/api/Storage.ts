import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const getPath = () => {
  const d = new Date();
  return `U-${d
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-")}--${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};

export const uploadFromBlobAsync = async (
  blobUrl: RequestInfo,
  name = getPath()
) => {
  try {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const storageRef = ref(getStorage(), name);
    const snapshot = await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(snapshot.ref);
    return { url, path: name };
  } catch (error) {
    throw error;
  }
};

export const tryUploadFromBlobAsync = async (
  blobUrl: RequestInfo,
  name: string
) => {
  const exists = await checkIfExists(name);
  if (!exists) {
    return uploadFromBlobAsync(blobUrl, name)
      .then(({ path }) => console.log(`${path} uploaded`))
      .catch(console.warn);
  } else {
    console.log(`File already exists: ${name}`);
  }
};

const checkIfExists = async (name: string) => {
  try {
    await getDownloadURL(ref(getStorage(), name));
    return true;
  } catch (error) {
    return false;
  }
};

export const deleteFromStorage = async (path: string) => {
  try {
    await deleteObject(ref(getStorage(), path));
    console.log(`${path} deleted`);
  } catch (error) {
    console.warn(error);
  }
};
