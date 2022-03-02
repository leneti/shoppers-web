import { doc, setDoc, getFirestore, updateDoc } from "firebase/firestore";
import { ItemData } from "./VisionParser";

export const saveBillToFirestoreAsync = async (
  firestorePath: string,
  data: any
) => {
  return setDoc(doc(getFirestore(), "bills", firestorePath), data);
};

export async function updateFirestoreDoc(
  firestorePath: string,
  data: {
    totals: {
      both: number;
      em: number;
      dom: number;
      full: number;
    };
    emilija: ItemData[];
    dom: ItemData[];
    common: ItemData[];
  }
) {
  try {
    await updateDoc(doc(getFirestore(), "bills", firestorePath), data);
    console.log(`${firestorePath} updated with the lists`);
  } catch (error) {
    console.error(error);
  }
}
