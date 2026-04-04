const firestore = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();
const auth = admin.auth();

// ── Helper: create Auth user ──────────────────────────────────────────────────
async function createUserWithEmailAndPassword(email, password, uid) {
  try {
    await auth.getUserByEmail(email);
    console.log(`User ${email} already exists in Auth.`);
    return;
  } catch (error) {
    if (error.code !== 'auth/user-not-found') throw error;
  }
  try {
    await auth.createUser({ uid, email, password, disabled: false });
    console.log(`✅ Auth account created for ${email}`);
  } catch (createError) {
    console.error("❌ Failed to create Auth user:", createError);
    throw new functions.https.HttpsError('internal', 'Could not create login account');
  }
}

// ── Helper: update Auth password ─────────────────────────────────────────────
async function updateAuthPassword(uid, newPassword) {
  try {
    await auth.updateUser(uid, { password: newPassword });
    console.log(`✅ Password updated in Auth for uid: ${uid}`);
  } catch (error) {
    console.error("❌ Failed to update Auth password:", error);
    throw new functions.https.HttpsError('internal', 'Could not update password');
  }
}

// ── TRIGGER 1: New teacher document → create Auth account ────────────────────
exports.autoCreateTeacherAuth = firestore.onDocumentCreated(
  "teachers/{teacherId}",
  async (event) => {
    const data = event.data.data();
    const teacherId = event.params.teacherId;

    if (!data.email || !data.pendingPassword) {
      console.log("⚠️ Missing email or password, skipping Auth creation.");
      return;
    }

    await createUserWithEmailAndPassword(data.email, data.pendingPassword, teacherId);

    // 🧹 Delete plain-text password from Firestore after Auth account created
    await event.data.ref.update({
      pendingPassword: admin.firestore.FieldValue.delete()
    });
    console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
  }
);

// ── TRIGGER 2: New student document → create Auth account ────────────────────
exports.autoCreateStudentAuth = firestore.onDocumentCreated(
  "students/{studentId}",
  async (event) => {
    const data = event.data.data();
    const studentId = event.params.studentId;

    if (!data.email || !data.pendingPassword) {
      console.log("⚠️ Missing email or password, skipping Auth creation.");
      return;
    }

    await createUserWithEmailAndPassword(data.email, data.pendingPassword, studentId);

    // 🧹 Delete plain-text password from Firestore after Auth account created
    await event.data.ref.update({
      pendingPassword: admin.firestore.FieldValue.delete()
    });
    console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
  }
);

// ── TRIGGER 3: Teacher document updated → sync password if changed ────────────
exports.onTeacherUpdated = firestore.onDocumentUpdated(
  "teachers/{teacherId}",
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();
    const teacherId = event.params.teacherId;

    // Only act if pendingPassword actually changed
    if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
      return;
    }

    await updateAuthPassword(teacherId, after.pendingPassword);

    // 🧹 Delete plain-text password & Add Audit Fields
    await event.data.after.ref.update({
      pendingPassword: admin.firestore.FieldValue.delete(),
      lastPasswordChanged: admin.firestore.Timestamp.now(),
      passwordChangedBy: after.passwordChangedBy || 'system' 
    });
    console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
  }
);

// ── TRIGGER 4: Student document updated → sync password if changed ────────────
exports.onStudentUpdated = firestore.onDocumentUpdated(
  "students/{studentId}",
  async (event) => {
    const before = event.data.before.data();
    const after  = event.data.after.data();
    const studentId = event.params.studentId;

    // Only act if pendingPassword actually changed
    if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
      return;
    }

    await updateAuthPassword(studentId, after.pendingPassword);

    // 🧹 Delete plain-text password & Add Audit Fields
    await event.data.after.ref.update({
      pendingPassword: admin.firestore.FieldValue.delete(),
      lastPasswordChanged: admin.firestore.Timestamp.now(),
      passwordChangedBy: after.passwordChangedBy || 'system'
    });
    console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
  }
);



   ///////   ///////   const firestore = require("firebase-functions/v2/firestore");
   ///////   ///////   const admin = require("firebase-admin");
   ///////   ///////   const functions = require("firebase-functions");
   ///////   ///////   admin.initializeApp();
   ///////   ///////   const auth = admin.auth();
   ///////   ///////   
   ///////   ///////   // ── Helper: create Auth user ──────────────────────────────────────────────────
   ///////   ///////   async function createUserWithEmailAndPassword(email, password, uid) {
   ///////   ///////     try {
   ///////   ///////       await auth.getUserByEmail(email);
   ///////   ///////       console.log(`User ${email} already exists in Auth.`);
   ///////   ///////       return;
   ///////   ///////     } catch (error) {
   ///////   ///////       if (error.code !== 'auth/user-not-found') throw error;
   ///////   ///////     }
   ///////   ///////     try {
   ///////   ///////       await auth.createUser({ uid, email, password, disabled: false });
   ///////   ///////       console.log(`✅ Auth account created for ${email}`);
   ///////   ///////     } catch (createError) {
   ///////   ///////       console.error("❌ Failed to create Auth user:", createError);
   ///////   ///////       throw new functions.https.HttpsError('internal', 'Could not create login account');
   ///////   ///////     }
   ///////   ///////   }
   ///////   ///////   
   ///////   ///////   // ── Helper: update Auth password ─────────────────────────────────────────────
   ///////   ///////   async function updateAuthPassword(uid, newPassword) {
   ///////   ///////     try {
   ///////   ///////       await auth.updateUser(uid, { password: newPassword });
   ///////   ///////       console.log(`✅ Password updated in Auth for uid: ${uid}`);
   ///////   ///////     } catch (error) {
   ///////   ///////       console.error("❌ Failed to update Auth password:", error);
   ///////   ///////       throw new functions.https.HttpsError('internal', 'Could not update password');
   ///////   ///////     }
   ///////   ///////   }
   ///////   ///////   
   ///////   ///////   // ── TRIGGER 1: New teacher document → create Auth account ────────────────────
   ///////   ///////   exports.autoCreateTeacherAuth = firestore.onDocumentCreated(
   ///////   ///////     "teachers/{teacherId}",
   ///////   ///////     async (event) => {
   ///////   ///////       const data = event.data.data();
   ///////   ///////       const teacherId = event.params.teacherId;
   ///////   ///////   
   ///////   ///////       if (!data.email || !data.pendingPassword) {
   ///////   ///////         console.log("⚠️ Missing email or password, skipping Auth creation.");
   ///////   ///////         return;
   ///////   ///////       }
   ///////   ///////   
   ///////   ///////       await createUserWithEmailAndPassword(data.email, data.pendingPassword, teacherId);
   ///////   ///////   
   ///////   ///////       // 🧹 Delete plain-text password from Firestore after Auth account created
   ///////   ///////       await event.data.ref.update({
   ///////   ///////         pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////       });
   ///////   ///////       console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
   ///////   ///////     }
   ///////   ///////   );
   ///////   ///////   
   ///////   ///////   // ── TRIGGER 2: New student document → create Auth account ────────────────────
   ///////   ///////   exports.autoCreateStudentAuth = firestore.onDocumentCreated(
   ///////   ///////     "students/{studentId}",
   ///////   ///////     async (event) => {
   ///////   ///////       const data = event.data.data();
   ///////   ///////       const studentId = event.params.studentId;
   ///////   ///////   
   ///////   ///////       if (!data.email || !data.pendingPassword) {
   ///////   ///////         console.log("⚠️ Missing email or password, skipping Auth creation.");
   ///////   ///////         return;
   ///////   ///////       }
   ///////   ///////   
   ///////   ///////       await createUserWithEmailAndPassword(data.email, data.pendingPassword, studentId);
   ///////   ///////   
   ///////   ///////       // 🧹 Delete plain-text password from Firestore after Auth account created
   ///////   ///////       await event.data.ref.update({
   ///////   ///////         pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////       });
   ///////   ///////       console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
   ///////   ///////     }
   ///////   ///////   );
   ///////   ///////   
   ///////   ///////   // ── TRIGGER 3: Teacher document updated → sync password if changed ────────────
   ///////   ///////   exports.onTeacherUpdated = firestore.onDocumentUpdated(
   ///////   ///////     "teachers/{teacherId}",
   ///////   ///////     async (event) => {
   ///////   ///////       const before = event.data.before.data();
   ///////   ///////       const after  = event.data.after.data();
   ///////   ///////       const teacherId = event.params.teacherId;
   ///////   ///////   
   ///////   ///////       // Only act if pendingPassword actually changed
   ///////   ///////       if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
   ///////   ///////         return;
   ///////   ///////       }
   ///////   ///////   
   ///////   ///////       await updateAuthPassword(teacherId, after.pendingPassword);
   ///////   ///////   
   ///////   ///////       // 🧹 Delete plain-text password from Firestore after Auth updated
   ///////   ///////       await event.data.after.ref.update({
   ///////   ///////         pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////       });
   ///////   ///////       console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
   ///////   ///////     }
   ///////   ///////   );
   ///////   ///////   
   ///////   ///////   // ── TRIGGER 4: Student document updated → sync password if changed ────────────
   ///////   ///////   exports.onStudentUpdated = firestore.onDocumentUpdated(
   ///////   ///////     "students/{studentId}",
   ///////   ///////     async (event) => {
   ///////   ///////       const before = event.data.before.data();
   ///////   ///////       const after  = event.data.after.data();
   ///////   ///////       const studentId = event.params.studentId;
   ///////   ///////   
   ///////   ///////       // Only act if pendingPassword actually changed
   ///////   ///////       if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
   ///////   ///////         return;
   ///////   ///////       }
   ///////   ///////   
   ///////   ///////       await updateAuthPassword(studentId, after.pendingPassword);
   ///////   ///////   
   ///////   ///////       // 🧹 Delete plain-text password from Firestore after Auth updated
   ///////   ///////       await event.data.after.ref.update({
   ///////   ///////         pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////       });
   ///////   ///////       console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
   ///////   ///////     }
   ///////   ///////   );
   ///////   ///////   mail);
   ///////   ///////      console.log(`User ${email} already exists in Auth.`);
   ///////   ///////      return;
   ///////   ///////    } catch (error) {
   ///////   ///////      if (error.code !== 'auth/user-not-found') throw error;
   ///////   ///////    }
   ///////   ///////    try {
   ///////   ///////      await auth.createUser({ uid, email, password, disabled: false });
   ///////   ///////      console.log(`✅ Auth account created for ${email}`);
   ///////   ///////    } catch (createError) {
   ///////   ///////      console.error("❌ Failed to create Auth user:", createError);
   ///////   ///////      throw new functions.https.HttpsError('internal', 'Could not create login account');
   ///////   ///////    }
   ///////   ///////  }
   ///////   ///////  
   ///////   ///////  // ── Helper: update Auth password ─────────────────────────────────────────────
   ///////   ///////  async function updateAuthPassword(uid, newPassword) {
   ///////   ///////    try {
   ///////   ///////      await auth.updateUser(uid, { password: newPassword });
   ///////   ///////      console.log(`✅ Password updated in Auth for uid: ${uid}`);
   ///////   ///////    } catch (error) {
   ///////   ///////      console.error("❌ Failed to update Auth password:", error);
   ///////   ///////      throw new functions.https.HttpsError('internal', 'Could not update password');
   ///////   ///////    }
   ///////   ///////  }
   ///////   ///////  
   ///////   ///////  // ── TRIGGER 1: New teacher document → create Auth account ────────────────────
   ///////   ///////  exports.autoCreateTeacherAuth = firestore.onDocumentCreated(
   ///////   ///////    "teachers/{teacherId}",
   ///////   ///////    async (event) => {
   ///////   ///////      const data = event.data.data();
   ///////   ///////      const teacherId = event.params.teacherId;
   ///////   ///////  
   ///////   ///////      if (!data.email || !data.pendingPassword) {
   ///////   ///////        console.log("⚠️ Missing email or password, skipping Auth creation.");
   ///////   ///////        return;
   ///////   ///////      }
   ///////   ///////  
   ///////   ///////      await createUserWithEmailAndPassword(data.email, data.pendingPassword, teacherId);
   ///////   ///////  
   ///////   ///////      // 🧹 Delete plain-text password from Firestore after Auth account created
   ///////   ///////      await event.data.ref.update({
   ///////   ///////        pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////      });
   ///////   ///////      console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
   ///////   ///////    }
   ///////   ///////  );
   ///////   ///////  
   ///////   ///////  // ── TRIGGER 2: New student document → create Auth account ────────────────────
   ///////   ///////  exports.autoCreateStudentAuth = firestore.onDocumentCreated(
   ///////   ///////    "students/{studentId}",
   ///////   ///////    async (event) => {
   ///////   ///////      const data = event.data.data();
   ///////   ///////      const studentId = event.params.studentId;
   ///////   ///////  
   ///////   ///////      if (!data.email || !data.pendingPassword) {
   ///////   ///////        console.log("⚠️ Missing email or password, skipping Auth creation.");
   ///////   ///////        return;
   ///////   ///////      }
   ///////   ///////  
   ///////   ///////      await createUserWithEmailAndPassword(data.email, data.pendingPassword, studentId);
   ///////   ///////  
   ///////   ///////      // 🧹 Delete plain-text password from Firestore after Auth account created
   ///////   ///////      await event.data.ref.update({
   ///////   ///////        pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////      });
   ///////   ///////      console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
   ///////   ///////    }
   ///////   ///////  );
   ///////   ///////  
   ///////   ///////  // ── TRIGGER 3: Teacher document updated → sync password if changed ────────────
   ///////   ///////  exports.onTeacherUpdated = firestore.onDocumentUpdated(
   ///////   ///////    "teachers/{teacherId}",
   ///////   ///////    async (event) => {
   ///////   ///////      const before = event.data.before.data();
   ///////   ///////      const after  = event.data.after.data();
   ///////   ///////      const teacherId = event.params.teacherId;
   ///////   ///////  
   ///////   ///////      // Only act if pendingPassword actually changed
   ///////   ///////      if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
   ///////   ///////        return;
   ///////   ///////      }
   ///////   ///////  
   ///////   ///////      await updateAuthPassword(teacherId, after.pendingPassword);
   ///////   ///////  
   ///////   ///////      // 🧹 Delete plain-text password from Firestore after Auth updated
   ///////   ///////      await event.data.after.ref.update({
   ///////   ///////        pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////      });
   ///////   ///////      console.log(`🧹 pendingPassword cleared for teacher: ${teacherId}`);
   ///////   ///////    }
   ///////   ///////  );
   ///////   ///////  
   ///////   ///////  // ── TRIGGER 4: Student document updated → sync password if changed ────────────
   ///////   ///////  exports.onStudentUpdated = firestore.onDocumentUpdated(
   ///////   ///////    "students/{studentId}",
   ///////   ///////    async (event) => {
   ///////   ///////      const before = event.data.before.data();
   ///////   ///////      const after  = event.data.after.data();
   ///////   ///////      const studentId = event.params.studentId;
   ///////   ///////  
   ///////   ///////      // Only act if pendingPassword actually changed
   ///////   ///////      if (!after.pendingPassword || after.pendingPassword === before.pendingPassword) {
   ///////   ///////        return;
   ///////   ///////      }
   ///////   ///////  
   ///////   ///////      await updateAuthPassword(studentId, after.pendingPassword);
   ///////   ///////  
   ///////   ///////      // 🧹 Delete plain-text password from Firestore after Auth updated
   ///////   ///////      await event.data.after.ref.update({
   ///////   ///////        pendingPassword: admin.firestore.FieldValue.delete()
   ///////   ///////      });
   ///////   ///////      console.log(`🧹 pendingPassword cleared for student: ${studentId}`);
   ///////   ///////    }
   ///////   ///////  );
   ///////   ///////  
