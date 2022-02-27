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
  return getDownloadURL(ref(getStorage(), name))
    .then(() =>
      console.log("\u001b[33m" + `File already exists: ${name}` + "\u001b[0m")
    )
    .catch(() => {
      uploadFromBlobAsync(blobUrl, name)
        .then(({ path }) => console.log(`${path} uploaded`))
        .catch(console.warn);
    });
};

export const deleteFromStorage = async (path: string) => {
  try {
    await deleteObject(ref(getStorage(), path));
    console.log(`${path} deleted`);
  } catch (error) {
    console.warn(error);
  }
};
