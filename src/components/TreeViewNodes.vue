<template>
  <div>
    <ul class="tree-view-nodes">
      <TreeViewNodesItem
        v-for="node in showAllNodes ? nodes : shortViewNodes"
        :key="node._id"
        :node="node"
      />
    </ul>
  </div>
</template>

<script>
import TreeViewNodesItem from "@/components/TreeViewNodesItem";

export default {
  props: {
    nodes: {
      type: Array,
    },
    shortViewNodes: {
      type: Array,
    },
    showAllNodes: {
      type: Boolean,
    },
  },
  components: {
    TreeViewNodesItem,
  },
};
</script>
