import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const getPath = () => {
  const d = new Date();
  return `U-${d
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-")}--${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
};
