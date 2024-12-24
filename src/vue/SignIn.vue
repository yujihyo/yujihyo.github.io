<template>
  <div>
    <div class="bg-image" />
    <div class="container">
      <div id="phone">
        <div id="content-wrapper">
          <!-- 로그인 카드 -->
          <div :class="['card', { hidden: !isLoginVisible }]" id="login">
            <form @submit.prevent="handleLogin">
              <h1>Sign in</h1>
              <div class="input" :class="{ 'active': isEmailFocused || email }">
                <input id="email" type="email" v-model="email" @focus="focusInput('email')" @blur="blurInput('email')">
                <label for="email">Username or Email</label>
              </div>
              <div class="input" :class="{ 'active': isPasswordFocused || password }">
                <input id="password" type="password" v-model="password" @focus="focusInput('password')" @blur="blurInput('password')">
                <label for="password">Password</label>
              </div>
              <span class="checkbox remember">
                <input type="checkbox" id="remember" v-model="rememberMe">
                <label for="remember" class="read-text">Remember me</label>
              </span>
              <span class="checkbox forgot">
                <a href="#">Forgot Password?</a>
              </span>
              <button :disabled="!isLoginFormValid">Login</button>
            </form>
            <!-- 카카오 로그인 버튼 -->
            <button type="button" id="kakao-login-btn" @click="loginWithKakao" class="kakao-button">
              카카오로 로그인
            </button>
            <a href="javascript:void(0)" class="account-check" @click="toggleCard">
              Already an account? <b>Sign in</b>
            </a>
          </div>

          <!-- 회원가입 카드 -->
          <div :class="['card', { hidden: isLoginVisible }]" id="register">
            <form @submit.prevent="handleRegister">
              <h1>Sign up</h1>
              <div class="input" :class="{ 'active': isRegisterEmailFocused || registerEmail }">
                <input id="register-email" type="email" v-model="registerEmail" @focus="focusInput('registerEmail')" @blur="blurInput('registerEmail')">
                <label for="register-email">Email</label>
              </div>
              <div class="input" :class="{ 'active': isRegisterPasswordFocused || registerPassword }">
                <input id="register-password" type="password" v-model="registerPassword" @focus="focusInput('registerPassword')" @blur="blurInput('registerPassword')">
                <label for="register-password">Password</label>
              </div>
              <div class="input" :class="{ 'active': isConfirmPasswordFocused || confirmPassword }">
                <input id="confirm-password" type="password" v-model="confirmPassword" @focus="focusInput('confirmPassword')" @blur="blurInput('confirmPassword')">
                <label for="confirm-password">Confirm Password</label>
              </div>
              <span class="checkbox remember">
                <input type="checkbox" id="terms" v-model="acceptTerms">
                <label for="terms" class="read-text">I have read <b>Terms and Conditions</b></label>
              </span>
              <button :disabled="!isRegisterFormValid">Register</button>
            </form>
            <a href="javascript:void(0)" id="gotologin" class="account-check" @click="toggleCard">
              Don't have an account? <b>Sign up</b>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { tryLogin, tryRegister } from '@/script/auth/Authentication.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const isLoginVisible = ref(true);
    const email = ref('');
    const password = ref('');
    const registerEmail = ref('');
    const registerPassword = ref('');
    const confirmPassword = ref('');
    const rememberMe = ref(false);
    const acceptTerms = ref(false);
    const isEmailFocused = ref(false);
    const isPasswordFocused = ref(false);
    const isRegisterEmailFocused = ref(false);
    const isRegisterPasswordFocused = ref(false);
    const isConfirmPasswordFocused = ref(false);

    const isLoginFormValid = computed(() => email.value && password.value);
    const isRegisterFormValid = computed(() =>
      registerEmail.value &&
      registerPassword.value &&
      confirmPassword.value &&
      registerPassword.value === confirmPassword.value &&
      acceptTerms.value
    );

    const toggleCard = () => {
      isLoginVisible.value = !isLoginVisible.value;
    };

    const focusInput = (inputName) => {
      if (inputName === 'email') isEmailFocused.value = true;
      if (inputName === 'password') isPasswordFocused.value = true;
      if (inputName === 'registerEmail') isRegisterEmailFocused.value = true;
      if (inputName === 'registerPassword') isRegisterPasswordFocused.value = true;
      if (inputName === 'confirmPassword') isConfirmPasswordFocused.value = true;
    };

    const blurInput = (inputName) => {
      if (inputName === 'email') isEmailFocused.value = false;
      if (inputName === 'password') isPasswordFocused.value = false;
      if (inputName === 'registerEmail') isRegisterEmailFocused.value = false;
      if (inputName === 'registerPassword') isRegisterPasswordFocused.value = false;
      if (inputName === 'confirmPassword') isConfirmPasswordFocused.value = false;
    };

    const handleLogin = () => {
      tryLogin(email.value, password.value, () => router.push('/'), () => alert('Login failed'));
    };

    const handleRegister = () => {
      tryRegister(
        registerEmail.value,
        registerPassword.value,
        toggleCard,
        (err) => alert(err)
      );
    };

    const loginWithKakao = () => {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(import.meta.env.VITE_KAKAO_API_KEY);
      }
      window.Kakao.Auth.login({
        success: (authObj) => {
          console.log('카카오 로그인 성공:', authObj);
          window.Kakao.API.request({
            url: '/v2/user/me',
            success: (res) => {
              console.log('사용자 정보:', res);
              alert(`환영합니다, ${res.kakao_account.profile.nickname}님!`);
              router.push('/');
            },
            fail: (err) => {
              console.error('사용자 정보 요청 실패:', err);
            },
          });
        },
        fail: (err) => {
          console.error('카카오 로그인 실패:', err);
          alert('카카오 로그인에 실패했습니다.');
        },
      });
    };

    return {
      isLoginVisible, email, password, registerEmail, registerPassword, confirmPassword,
      rememberMe, acceptTerms, isEmailFocused, isPasswordFocused, isRegisterEmailFocused,
      isRegisterPasswordFocused, isConfirmPasswordFocused, isLoginFormValid,
      isRegisterFormValid, toggleCard, focusInput, blurInput, handleLogin, handleRegister,
      loginWithKakao,
    };
  },
};
</script>

<style scoped>
/* 기존 스타일 유지 */
.kakao-button {
  background-color: #fee500;
  color: #000;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin-top: 15px;
  width: 100%;
  cursor: pointer;
  display: block;
  text-align: center;
}

.kakao-button:hover {
  background-color: #ffeb00;
}
</style>
