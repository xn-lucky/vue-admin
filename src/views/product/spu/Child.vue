<template>
  <div>
    <!-- <el-button @click="$emit('update:num', num + 1)">点击child</el-button> -->
    <!-- <el-button @click="$emit('update:num', num + 1)">点击child</el-button> -->

    <el-input
      v-if="show"
      v-model="num"
      size="mini"
      autofocus
      @blur="show = false"
      ref="input"
    ></el-input>
    <span v-else @click="clickSpan">点我</span>
  </div>
</template>

<script>
export default {
  name: "Child",
  data() {
    return {
      show: false,
    };
  },
  props: ["num"],
  methods: {
    clickSpan() {
      this.show = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },
  mounted() {
    console.log("child", this);
  },
};
</script>

<style lang="sass" scoped>
</style>
