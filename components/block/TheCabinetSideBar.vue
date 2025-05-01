<template>
  <header class="side-bar-cabinet">
    <div class="side-bar-cabinet__top">
      <div class="side-bar-cabinet__top__logo">
        <NuxtLink to="/"><UiIconLogo /></NuxtLink>
      </div>
      <div class="side-bar-cabinet__top__profile">
        <NuxtLink to="/ru/profile">
        <div class="side-bar-cabinet__top__profile__image">
          <UiIconUser />
        </div>
        </NuxtLink>
<!--        <div class="side-bar-cabinet__top__profile__name">-->
<!--          <NuxtLink to="/ru/profile">-->
<!--            Firstname-->
<!--          </NuxtLink>-->
<!--        </div>-->
      </div>
    </div>
    <div class="side-bar-cabinet__content">
      <TheCabinetSideBarMenu />
    </div>
    <div class="side-bar-cabinet__bottom">
      <UiIconGlobe />
      <UiIconMoon />
      <UiIconLogout @click="handleClickLogout" />
    </div>
  </header>
</template>

<script lang="ts" setup>
import UiIconLogo from "~/components/ui/UiIconLogo.vue";
import TheCabinetSideBarMenu from "~/components/block/TheCabinetSideBarMenu.vue";
import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
import UiIconLogout from "~/components/ui/UiIconLogout.vue";
import UiIconGlobe from "~/components/ui/UiIconGlobe.vue";
import UiIconMoon from "~/components/ui/UiIconMoon.vue";
import UiIconUser from "~/components/ui/UiIconUser.vue";
import {useAuthStore} from "~/stores/authStore";
import {useRoute} from "vue-router";
import {navigateTo} from "nuxt/app";

const authStore = useAuthStore();
const router = useRoute();

const handleClickLogout = () => {
  authStore.setAccessToken('');
  authStore.setRefreshToken('');
  navigateTo('/auth/login')
}
</script>

<style lang="scss" scoped>
.side-bar-cabinet {
  position: fixed;
  color: white;
  height: 100vh;
  width: 6.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-right: 1px solid var(--color-stroke-ui-dark);
  background-color: var(--color-ui-background-opacity-80);
  z-index: 1;

  box-shadow: 0 0 5px -1px rgba(255, 249, 249, 0.1);
  //animation: shadowPulse 2s infinite alternate ease-in-out;
  transition: .5s;

  &:hover {
    transition: .3s;
    box-shadow: 0 0 5px 1px var(--color-stroke-ui-dark);
  }

  &__top {
    overflow: hidden;
    height: auto;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    flex-direction: column;

    &__logo {
      height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    &__profile {

      &__image {
        margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 60px;
        width: 60px;
        border: 3px solid var(--color-stroke-ui-dark);
        border-radius: 25%;
      }

      &__name {
        margin-top: 15px;
        width: 100%;
        font-size: 13px;
      }
    }
  }

  &__content {
    height: calc(100vh - 160px);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bottom {
    height: 72px;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--color-stroke-ui-dark);

    padding: 0 10px;
  }
}

@keyframes shadowPulse {
  0% {
    box-shadow: 0 0 1px -1px var(--color-ui-background);
  }
  100% {
    box-shadow: 0 0 5px 1px var(--color-stroke-ui-dark);
  }
}
</style>
