<template>
  <li class="side-bar-cabinet__menu__item"
      :class="{'active': isActive}"
      @click="handleClickMenuItem($event)"
  >
    <div class="side-bar-cabinet__menu__item__indicator"
         :class="{'active': isActive}"
    ></div>

    <div class="side-bar-cabinet__menu__item__icon">
      <component :is="icon"></component>
    </div>

    <div class="side-bar-cabinet__menu__item__title"
         :class="{'hide': !props.sideBarIsOpen}"
    >
      {{ title }}
    </div>
  </li>
</template>

<script lang="ts" setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const emit = defineEmits(['click'])

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    default: ""
  },
  sideBarIsOpen: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const isActive = computed(() => route.path === props.to)

const handleClickMenuItem = (event: Event) => emit('click', props.to)
</script>

<style lang="scss" scoped>
.side-bar-cabinet__menu__item {
  position: relative;
  display: flex;
  align-items: center;

  margin-top: 1px;
  height: 50px;

  background-color: transparent;

  transition: .3s;

  &:hover {
    transition: .3s;
    background-color: var(--color-stroke-ui-dark);
  }

  &.active {
    border-right: 1px solid var(--color-ui-primary);
  }

  &__indicator {
    position: absolute;
    width: 8px;
    height: 100%;

    background-color: var(--color-stroke-ui-dark);

    &.active {
      background-color: var(--color-ui-primary);
    }
  }

  &__icon {
    padding-left: 20px;
  }

  &__title {
    padding-left: 20px;
    width: 100%;
    height: 100%;
    transition: 3s;
    opacity: 1;
    white-space: nowrap;
    cursor: pointer;

    z-index: 3;
    display: flex;
    align-items: center;

    color: #d8d8d8;
    font-size: 14px;
    font-weight: 500;

    &:hover {
      color: #a9a9a9;
    }

    &.hide {
      transition: .1s;
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    //a {
    //  z-index: 3;
    //  display: flex;
    //  align-items: center;
    //
    //  width: 100%;
    //  height: 100%;
    //
    //  color: #210e32;
    //  font-size: 14px;
    //  font-weight: 500;
    //
    //  &:hover {
    //    color: #210e32;
    //  }
    //}
  }
}
//.side-bar-cabinet {
//  &__menu {
//    &__item {
//      width: 100%;
//      height: 70px;
//      display: flex;
//      align-items: center;
//      justify-content: center;
//
//      &:hover {
//        background-color: var(--color-ui-primary);
//      }
//
//      &.active {
//        background-color: var(--color-stroke-ui-dark);
//      }
//    }
//  }
//}
</style>
