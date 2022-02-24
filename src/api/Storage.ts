import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const uploadFromBlobAsync = async (
  blobUrl: RequestInfo,
  name: string
) => {
  if (!blobUrl || !name) return null;

  try {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    const storageRef = ref(getStorage(), name);
    const snapshot = await uploadBytes(storageRef, blob);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    throw error;
  }
};
