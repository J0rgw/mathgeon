import { User } from "firebase/auth";
import { ref, get, set, getDatabase } from "firebase/database";

export const saveHighScore = async (user: User, levelUid: string, newHS: number) => {
    const db = getDatabase();
    const snapshot = await get(ref(db, `userProgress/${user.uid}/${levelUid}/score`));
    if (!snapshot.exists()) {
        set(ref(db, `userProgress/${user.uid}/${levelUid}/score`), newHS);
        // console.log("a");
        
    } else if (snapshot.val() < newHS) {
        set(ref(db, `userProgress/${user.uid}/${levelUid}/score`), newHS);
        // console.log("b");
        
    }
    // else, we do nothing
};