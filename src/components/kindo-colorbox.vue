<template>
  <div class="color-box" :class="theme">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "kindo-colorbox",

  props: {
    // blue, dark-blue, success, warning, danger
    theme: {
      type: String,
      default: () => {
        return "blue";
      }
    }
  },

  computed: {
    themeClass: () => {
      return this.theme;
    }
  }
};
</script>

<style scoped>
.color-box {
  border-radius: 4px;
  padding: 10px;
  box-sizing: border-box;
  color: #fff;
  font-size: 14px;
}
/*基础样式 end*/

.white {
  background-color: #fff;
  color: #444;
}

.light-blue {
  background-color: #58b7ff;
}

.blue {
  background-color: #00bdd6;
}

.dark-blue {
  background-color: #1d8ce0;
}

.success {
  background-color: #13ce66;
}

.warning {
  background-color: #f7ba2a;
}

.danger {
  background-color: #ff4949;
}
/*主题色 end*/

.cyan {
  background-color: #cddbe6;
  color: #ffffff;
}
</style>
