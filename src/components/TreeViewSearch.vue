<template>
  <div class="search">
    <label class="label search__label">
      <span class="label__text">Поиск</span>
      <input
        v-model.trim="searchString"
        @input="$emit('search', searchString)"
        class="input-field"
        type="text"
        placeholder="Поиск..."
      />
    </label>
    <div class="search-setting">
      <TreeViewButton
        @click.native="$emit('case-sensitive-search')"
        class="button search-setting__button"
        :class="{ 'search-setting__button--active': modeSearchByCase }"
        >Аа</TreeViewButton
      >
      <p class="search-setting__info" v-if="modeSearchByCase">
        Поиск с учетом регистра включен
      </p>
    </div>
  </div>
</template>

<script>
import TreeViewButton from "@/components/TreeViewButton";

export default {
  data() {
    return {
      searchString: "",
    };
  },
  props: {
    modeSearchByCase: {
      type: Boolean,
    },
  },
  components: {
    TreeViewButton,
  },
};
</script>
