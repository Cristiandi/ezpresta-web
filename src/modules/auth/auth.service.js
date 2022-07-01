import axios from "axios";
import {
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithPopup,
  // getAdditionalUserInfo,
} from "firebase/auth";

import environment from "../../environment";
import { setFirebaseProviderId } from "../../utils";

import firebaseApp from "../../firebase";

// const googleAuthProvider = new GoogleAuthProvider();

class AuthService {
  async sendOTP({ phoneCode, phoneNumber, channel }) {
    await axios({
      url: `${environment.API_URL}authentication/otp`,
      method: "POST",
      data: {
        phoneCode: "" + phoneCode,
        phoneNumber: "" + phoneNumber,
        channel,
      },
    });

    return {
      message: "OTP sent successfully",
    };
  }

  async verifyOTP({ phoneCode, phoneNumber, otp }) {
    const {
      data: { customToken },
    } = await axios({
      url: `${environment.API_URL}authentication/otp`,
      method: "PATCH",
      data: {
        phoneCode: "" + phoneCode,
        phoneNumber: "" + phoneNumber,
        otp,
      },
    });

    const auth = getAuth(firebaseApp);

    const userCredential = await signInWithCustomToken(auth, customToken);

    const { providerId } = userCredential;

    if (providerId) setFirebaseProviderId(providerId);
  }

  async login({ email, password }) {
    // console.log("LOGIN WITH EMAIL");

    const auth = getAuth(firebaseApp);

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const { providerId } = userCredential;

    if (providerId) setFirebaseProviderId(providerId);
  }

  loginWithGoogle() {
    // console.log("LOGIN WITH GOOGLE");

    throw new Error("Not implemented");

    /*
    googleAuthProvider.setCustomParameters({
      prompt: "select_account"
    });

    googleAuthProvider.addScope("profile");
    googleAuthProvider.addScope("email");

    const auth = getAuth(firebaseApp);

    const result = await signInWithPopup(auth, googleAuthProvider);

    const additionalUserInfo = await getAdditionalUserInfo(result);

    const { isNewUser } = additionalUserInfo;

    const { user } = result;

    if (isNewUser) {
      // console.log('NEW USER');
      const authUid = user.uid;
      const email = user.email;
      const fullName = additionalUserInfo.profile.name || user.displayName;
      const phone = user.phoneNumber || null;

      await this.registerFromAuthUid({
        authUid,
        email,
        fullName,
        phone
      });
    }

    console.log("LOGIN WITH GOOGLE RESULT", result);

    setFirebaseProviderId(result.providerId);

    */
  }

  async logout() {
    const auth = getAuth(firebaseApp);

    if (auth.currentUser) await auth.signOut();
  }

  async sendResetPasswordEmail({ email }) {
    const { data } = await axios({
      url: `${environment.API_URL}users/reset-password-email`,
      method: "POST",
      data: {
        email,
      },
    });

    return {
      ...data,
      message: "Email enviado, por favor revisa tu bandeja de entrada",
    };
  }
}

const authService = new AuthService();

export default authService;
