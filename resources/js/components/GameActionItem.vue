<template>
  <div class="action-item" @click="selectItem()">
    <i class="item-icon mdi" :class="'mdi-' + getIcon()"></i>
    <div class="title">{{ getName() }}</div>
    <div class="price"> ${{ getPrice() }}</div>
  </div>
</template>

<script>
import ActionItem from '../classes/actionItem'
export default {
  props: {
    actionItem: {
      type: ActionItem,
      required: true
    },
  },
  // data() {
  //   // Your data properties here
  // },
  methods: {
    getName() {
      return this.actionItem.getActionName()
    },
    getPrice() {
      return this.actionItem.getPrice()
    },
    getIcon() {
      return this.actionItem.getIcon()
    },
    selectItem() {
      this.$emit('onClickItem')
    }
  },
}
</script>

<style scoped>

.action-item {
  background-color: #f2f2f2;
  padding: 2px;
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.action-item .title {
  /* margin-bottom: 5px; */
}

.action-item .price {
  font-size: 12px;
  margin-left: auto;
}

.action-item:hover {
  background-color: #dcdcdc;
}

.item-icon {
  font-size: 16px;
  margin-right: 5px;
}
/* Your component styles here */
</style>
