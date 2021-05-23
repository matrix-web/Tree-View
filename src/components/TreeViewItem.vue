<template>
  <li class="tree-view__item">
    <TreeViewItemHead
      @toggle="toggle"
      :root="item.root"
      :count-elements="item.children.length"
      :show-all-nodes="isShownNodes"
    />
    <TreeViewNodes
      :nodes="item.children"
      :short-view-nodes="shortViewNodes"
      :show-all-nodes="isShownNodes"
    />
  </li>
</template>

<script>
import TreeViewItemHead from "@/components/TreeViewItemHead";
import TreeViewNodes from "@/components/TreeViewNodes";

export default {
  data() {
    return {
      isShownNodes: false,
      shortViewNodes: null,
    };
  },
  methods: {
    shortViewListMain() {
      let count = 0;
      const shortViewMain = this.item.children.filter((child) => {
        if (child.main && count < 5) {
          count++;
          return child;
        }
      });

      if (shortViewMain) {
        this.shortViewNodes = shortViewMain;
      }
    },
    shortViewListNotMain() {
      let count = 0;
      const isNotMain = this.item.children.every((child) => !child.main);

      const shortViewNotMain = this.item.children.filter((child) => {
        if (isNotMain && count < 5) {
          count++;
          return child;
        }
      });

      if (shortViewNotMain.length) {
        this.shortViewNodes = shortViewNotMain;
      }
    },
    toggle() {
      this.isShownNodes = !this.isShownNodes;
    },
  },
  watch: {
    "item.children"() {
      this.shortViewListMain();
      this.shortViewListNotMain();
    },
  },
  mounted() {
    this.shortViewListMain();
    this.shortViewListNotMain();
  },
  props: {
    item: {
      type: Object,
    },
  },
  components: {
    TreeViewItemHead,
    TreeViewNodes,
  },
};
</script>
