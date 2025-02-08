<template>
  <div class="access-page">
    <div class="access-page__title">
      <UiTextH1>Access controls</UiTextH1>
      <UiTextParagraph>( Roles and Permissions )</UiTextParagraph>
    </div>
    <div class="access-page__content">
      <div class="access-page__content__top">
        <div class="access-page__content__top__left">
          <RolesPanel />
        </div>
        <div class="access-page__content__top__right">
          <PermissionsPanel/>
        </div>
      </div>
      <br>
      <div class="access-page__content__bottom">
        <UsersPanel/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import UiTextH1 from "~/components/ui/UiTextH1.vue";
import UiTextParagraph from "~/components/ui/UiTextParagraph.vue";
import RolesPanel from "~/pages/access/components/RolesPanel.vue";
import PermissionsPanel from "~/pages/access/components/PermissionsPanel.vue";
import UsersPanel from "~/pages/access/components/UsersPanel.vue";
</script>

<style lang="scss" scoped>
.access {
  &-page {
    height: calc(100vh - 40px);
    width: 100%;
    padding: 20px;

    &__title {
      margin-bottom: 20px;
    }

    &__content {

      &__top {
        display: flex;
        justify-content: space-between;
        gap: 20px;

        @media (max-width: 1130px) {
          flex-direction: column;
        }

        &__left {
          width: 100%;
        }

        &__right {
          width: 100%;
        }
      }

      &__bottom {}
    }
  }
}
</style>