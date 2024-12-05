<template>
  <div class="table-container">
    <table class="table">
      <thead>
      <tr>
        <th
            v-for="(col, index) in columns"
            :key="'head-' + index"
            class="table__header"
        >
          {{ col.title }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="(row, rowIndex) in data"
          :key="'row-' + rowIndex"
          class="table__row"
      >
        <td
            v-for="(col, colIndex) in columns"
            :key="'cell-' + rowIndex + '-' + colIndex"
            class="table__cell"
        >
          <span v-if="Array.isArray(row[col.key])">
              {{ row[col.key].join(', ') }}
          </span>
          <span v-else>
              {{ row[col.key] !== undefined ? row[col.key] : '-' }}
          </span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  columns: {
    type: Array as () => { title: string; key: string }[],
    default: () => []
  },
  data: {
    type: Array as () => Record<string, any>[],
    default: () => []
  }
});
</script>

<style lang="scss" scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  font-family: Montserrat, sans-serif;
  //border: 1px solid #ddd;
}

.table th {
  padding: 5px 10px;
  text-align: left;
}

.table td {
  padding: 10px;
  text-align: left;
}

.table__header {
  background-color: #c8c8c8;
  color: #3e3939;
  font-weight: 500;
  border: 1px solid #ddd;

  &:first-child {
    border-left: none;
  }

  &:last-child {
    border-right: none;
  }
}

.table__row:nth-child(even) {
  background-color: #f9f9f9;
}

.table__row:hover {
  background-color: #f1f1f1;
}

.table__cell {
  //border: 1px solid #ddd;
}

.table__cell:last-child {
  text-align: center;
}
</style>