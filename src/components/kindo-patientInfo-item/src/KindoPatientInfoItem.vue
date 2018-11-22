<template>
  <div class="patient-item-group">
    <div class="patient-item-title" :title="title">
      <div class="patient-item-title-inline" :class="titleClass">{{title}}</div>
    </div>
    <div class="patient-item-title-icon" :class="titleClass">：</div>
    <div class="patient-item-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'kindo-patientInfo-item',
  data() {
    return {}
  },
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    titleClass: {
      type: String,
      default: () => {
        return ''
      }
    }
  }
}
</script>
<style scoped>
.patient-item-group {
  width: 100%;
  display: inline-table;
}

.patient-item-title {
  width: 100px;
  /* width: 40%; */
  display: table-cell;
  text-align: right;
}

.patient-item-title-inline {
  width: 120px;
  height: 24px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.patient-item-title-icon {
  display: table-cell;
  width: 12px;
}

.patient-item-content {
  /* width: 45%; */
  display: table-cell;
}

.greyClass {
  color: #bebebe;
}
</style>