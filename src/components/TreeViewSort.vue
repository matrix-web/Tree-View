<template>
  <div class="sort">
    <TreeViewButton
      @click.native="$emit('sort', sortByASC)"
      class="button mr-15"
      :class="{ 'sort__button--active': sortAsc }"
    >
      <i class="fas fa-sort-alpha-up"></i>
    </TreeViewButton>
    <TreeViewButton
      @click.native="$emit('sort', sortByDESC)"
      class="button"
      :class="{ 'sort__button--active': sortDesc }"
    >
      <i class="fas fa-sort-alpha-up-alt"></i>
    </TreeViewButton>
  </div>
</template>

<script>
import TreeViewButton from "@/components/TreeViewButton";

export default {
  data() {
    return {
      sortByASC: "ASC",
      sortByDESC: "DESC",
    };
  },
  props: {
    sortAsc: {
      type: Boolean,
    },
    sortDesc: {
      type: Boolean,
    },
  },
  components: {
    TreeViewButton,
  },
};
</script>
