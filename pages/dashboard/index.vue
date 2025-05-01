<template>
  <UiContainer>
    <div class="dashboard">
      <div class="dashboard__title">
        <UiTextH4>Dashboard</UiTextH4>
      </div>
      <div class="dashboard__grid">

        <!-- Account Verification -->
        <PanelDefault>
          <div class="card">
            <div class="card__header">
              <!--          <div class="card__icon">-->
              <!--            <svg viewBox="0 0 20 20" fill="currentColor"><path d="M18 13v-2H6v2h12zm0 2H6v2h12v-2zM6 7h12v2H6V7z"/></svg>-->
              <!--          </div>-->
              <div>
                <div class="card__title">Account Verification</div>
                <div class="card__subtitle">Verification in progress</div>
              </div>
              <UiButtonDefault state="primary">Profile</UiButtonDefault>
            </div>
            <ul class="card__list">
              <li>
                <UiIconFailed />
                <span>Address verification failed!</span>
              </li>
              <li>
                <UiIconSuccess />
                <span>Document successfully verified!</span>
              </li>
              <li>
                <UiIconWarning />
                <span>Payment verification in progress!</span>
              </li>
              <li>
                <UiIconWarning />
                <span>Profile verification in progress!</span>
              </li>
            </ul>
          </div>
        </PanelDefault>

<!--        background-color: var(&#45;&#45;ui-background-panel);-->
<!--        border: 1px solid var(&#45;&#45;color-stroke-ui-dark);-->

        <PanelDefault>
          <div class="card">
            <div class="card__actions">
              <UiButtonDefault state="success">New Deposit</UiButtonDefault>
              <UiButtonDefault state="primary">New Withdrawal</UiButtonDefault>
            </div>
            <div class="chart-placeholder">Chart will go here</div>
          </div>
        </PanelDefault>

        <PanelDefault>
          <div class="card card--wide">
          <div class="card__top">
            <div class="card__title">MT4 Accounts</div>
            <div class="card__options">
              <UiButtonDefault state="primary">Open new account</UiButtonDefault>
            </div>
          </div>
          <table class="table">
            <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>123456</td>
              <td>Real</td>
              <td>$5,000.00</td>
              <td><span class="status status--active">Active</span></td>
            </tr>
            <tr>
              <td>234567</td>
              <td>Real</td>
              <td>$5,000.00</td>
              <td><span class="status status--active">Active</span></td>
            </tr>
            <tr>
              <td>345678</td>
              <td>Demo</td>
              <td>$10,000.00</td>
              <td><span class="status status--inactive">Inactive</span></td>
            </tr>
            </tbody>
          </table>
        </div>
        </PanelDefault>
      </div>
    </div>
  </UiContainer>
</template>

<script lang="ts" setup>
import { definePageMeta } from '~/.nuxt/imports';

import UiButtonDefault from "~/components/ui/UiButtonDefault.vue";
import UiIconSuccess from "~/components/ui/UiIconSuccess.vue";
import UiIconFailed from "~/components/ui/UiIconFailed.vue";
import UiIconWarning from "~/components/ui/UiIconWarning.vue";

definePageMeta({ layout: 'cabinet', middleware: ['auth-client'] });

import { useI18n } from 'vue-i18n'
import UiContainer from "~/components/ui/UiContainer.vue";
import UiTextH3 from "~/components/ui/UiTextH3.vue";
import UiTextH4 from "~/components/ui/UiTextH4.vue";
import PanelDefault from "~/components/block/panels/PanelDefault.vue";
const { locale } = useI18n({ useScope: 'global' })
</script>

<style lang="scss" scoped>
.dashboard {
  color: #FFFFFF;

  &__title {
    //font-size: 24px;
    //font-weight: bold;
    margin-bottom: 24px;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}

.card {
  padding: 1.6rem;
  border-radius: 16px;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &--wide {
    grid-column: span 2;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__icon {
    background: #FF9C27;
    padding: 8px;
    border-radius: 50%;
    margin-right: 16px;
    color: white;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 18px;
    font-weight: 600;
  }

  &__options {
  }

  &__subtitle {
    font-size: 14px;
    color: #A3AED0;
  }

  &__list {
    list-style: none;
    padding-left: 0;
    margin-top: 12px;
    font-size: 14px;
    color: #E4E9F2;
    margin-bottom: 20px;

    li {
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        margin-left: 20px;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
  }
}

.chart-placeholder {
  height: 160px;
  background-color: #1A1D3B;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #A3AED0;
  font-size: 14px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #FFFFFF;

  th {
    text-align: left;
    padding-bottom: 8px;
    color: #A3AED0;
  }

  td {
    padding: 8px 0;
    border-top: 1px solid #2E335A;
  }
}

.status {
  &--active {
    color: #1CBF73;
    font-weight: 500;
  }

  &--inactive {
    color: #A3AED0;
    font-weight: 500;
  }
}
</style>