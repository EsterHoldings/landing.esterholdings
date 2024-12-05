<template>
  <div class="pagination">
    <div class="pagination__column pagination__column-left">
      <span>Per page:</span>
      <select class="custom-select">
        <option>3</option>
        <option selected>4</option>
        <option>5</option>
        <option>10</option>
        <option>20</option>
        <option>25</option>
        <option>50</option>
        <option>100</option>
      </select>
    </div>
    <div class="pagination__items pagination__column">
      <div class="pagination__item"><<</div>
      <div class="pagination__item"><</div>
      <div class="pagination__item">3</div>
      <div class="pagination__item">4</div>
      <div class="pagination__item">5</div>
      <div class="pagination__item">></div>
      <div class="pagination__item">>></div>
    </div>
    <div class="pagination__column pagination__column-right">
      From 1 to 4 / Total: 23
    </div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>
.custom-select {
  padding: 5px;
  border: 1px solid gainsboro;
  border-radius: 3px;
}

.pagination {
  padding: 10px 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  &__column {
    min-width: min-content;
    max-width: 33%;
    width: 100%;

    &-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;

      span {
        font-size: 12px;
        font-weight: 600;
        margin-right: 5px;
      }
    }

    &-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;

      font-size: 12px;
      font-weight: 600;
    }
  }

  &__items {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__item {

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 5px;
    border: 1px solid gainsboro;
    border-radius: 3px;

    margin-right: 5px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>