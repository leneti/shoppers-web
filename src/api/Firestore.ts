import { doc, setDoc, getFirestore } from "firebase/firestore";

export const saveBillToFirestoreAsync = async (name: string, data: any) => {
  return setDoc(doc(getFirestore(), "bills", name), data);
};
