<template>
  <div class="tree-view__item-head">
    <button class="tree-view__item-button" @click="$emit('toggle')">
      <i
        :class="[showAllNodes ? 'fas fa-minus-circle' : 'fas fa-plus-circle']"
      ></i>
    </button>
    <span class="tree-view__item-title">{{ root.toUpperCase() }}</span>
    <span class="tree-view__item-count">({{ countElements }})</span>
  </div>
</template>

<script>
export default {
  props: {
    root: {
      type: String,
    },
    countElements: {
      type: Number,
    },
    showAllNodes: {
      type: Boolean,
    },
  },
};
</script>
