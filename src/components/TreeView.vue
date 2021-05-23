<template>
  <div>
    <TreeViewSort
      @sort="sortItems"
      :sortAsc="isSortAsc"
      :sortDesc="isSortDesc"
    />
    <TreeViewSearch
      @search="searchItems"
      @case-sensitive-search="searchByCase"
      :modeSearchByCase="isSearchByCase"
    />
    <div class="tree-view__new-item">
      <h4 class="mb-15">Добавить новый элемент</h4>
      <div class="field-group mb-15">
        <input
          v-model="newItem.title"
          @input="fieldRequired(newItem.title)"
          @focus="dirty = true"
          @blur="dirty = false"
          type="text"
          class="input-field tree-view-nodes__item-field"
          :class="{ 'input-field--invalid': !required && dirty }"
          placeholder="Введите title"
        />
        <p class="invalid mt-5" v-if="!required && dirty">
          Поле обязательно для заполнения
        </p>
      </div>
      <div class="field-group mb-10">
        <label class="checkbox">
          <input
            class="checkbox__real"
            v-model.trim="newItem.main"
            type="checkbox"
          />
          <span class="checkbox__custom"></span>
          main
        </label>
      </div>
      <button @click="addNewItem" class="button">Добавить</button>
    </div>
    <ul class="tree-view">
      <template v-if="isSearch && isSearchFilled">
        <TreeViewItem
          v-for="searchItem in searchedItems"
          :key="searchItem.id"
          :item="searchItem"
        />
      </template>
      <li v-else-if="isSearchFilled && !isSearch">Результат отсутствует</li>
      <template v-else>
        <TreeViewItem v-for="item in sortingList" :key="item.id" :item="item" />
      </template>
    </ul>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TreeViewSort from "@/components/TreeViewSort";
import TreeViewSearch from "@/components/TreeViewSearch";
import TreeViewItem from "@/components/TreeViewItem";

export default {
  data() {
    return {
      searchedItems: null,
      isSearchByCase: false,
      isSortAsc: true,
      isSortDesc: false,
      isSearchFilled: false,
      required: false,
      dirty: false,
      sortingList: this.items,
      searchStr: "",
      newItem: {
        title: "",
        main: false,
      },
    };
  },
  props: {
    items: {
      type: Array,
    },
  },
  watch: {
    sortingList() {
      this.searchedItems = this.sortingList
        .map((item) => {
          const foundChildElements = item.children.filter((child) => {
            return (
              this.searchStr.length &&
              child.title
                .toLowerCase()
                .indexOf(
                  this.isSearchByCase
                    ? this.searchStr.toLowerCase()
                    : this.searchStr
                ) !== -1
            );
          });

          if (foundChildElements.length) {
            return {
              ...item,
              children: foundChildElements,
            };
          }
        })
        .filter((item) => item);
    },
    items(newValue) {
      this.sortingList = newValue;
    },
  },
  computed: {
    isSearch() {
      return Array.isArray(this.searchedItems) && this.searchedItems.length
        ? true
        : false;
    },
  },
  methods: {
    ...mapActions(["addBrand"]),
    searchItems(searchString) {
      if (searchString.length) {
        this.isSearchFilled = true;
        this.searchStr = searchString;

        this.searchedItems = this.sortingList
          .map((item) => {
            const foundChildElements = item.children.filter((child) => {
              return (
                searchString.length &&
                child.title
                  .toLowerCase()
                  .indexOf(
                    this.isSearchByCase
                      ? searchString.toLowerCase()
                      : searchString
                  ) !== -1
              );
            });

            if (foundChildElements.length) {
              return {
                ...item,
                children: foundChildElements,
              };
            }
          })
          .filter((item) => item);
      } else {
        this.isSearchFilled = false;
      }
    },
    async addNewItem() {
      if (this.required) {
        await this.addBrand(this.newItem);

        if (this.$store.state.added) {
          this.$message("Элемент успешно добавлен!");

          this.newItem = {};

          this.$nextTick(() => {
            this.$store.commit("setAdded", false);
          });
        }
      }
    },
    searchByCase() {
      this.isSearchByCase = !this.isSearchByCase;
    },
    sortItems(sortType) {
      if (sortType.toLowerCase() === "ASC".toLowerCase()) {
        this.isSortAsc = true;
        this.isSortDesc = false;
        this.sortingList = this.items
          .map((item) => ({
            ...item,
            children: item.children.sort((a, b) =>
              a.title.localeCompare(b.title)
            ),
          }))
          .sort((a, b) => a.root.localeCompare(b.root));
      } else if (sortType.toLowerCase() === "DESC".toLowerCase()) {
        this.isSortAsc = false;
        this.isSortDesc = true;
        this.sortingList = this.items
          .map((item) => ({
            ...item,
            children: item.children.sort((a, b) =>
              b.title.localeCompare(a.title)
            ),
          }))
          .sort((a, b) => b.root.localeCompare(a.root));
      }
    },
    fieldRequired(value) {
      this.required = !!value;
    },
  },
  components: {
    TreeViewSort,
    TreeViewSearch,
    TreeViewItem,
  },
};
</script>
