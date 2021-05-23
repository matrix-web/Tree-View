<template>
  <div id="app">
    <TheLoader v-if="loading" />
    <TreeView :items="tree" v-else />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import TreeView from "@/components/TreeView";
import TheLoader from "@/components/TheLoader";
import Vue from "vue";

export default {
  name: "App",
  data() {
    return {
      treeData: [
        {
          id: 1,
          title: "lerry",
          main: false,
        },
        {
          id: 2,
          title: "luicy",
          main: true,
        },
        {
          id: 3,
          title: "B3ach Boys",
          main: false,
        },
        {
          id: 4,
          title: "banner",
          main: false,
        },
        {
          id: 5,
          title: "bruce",
          main: false,
        },
        {
          id: 6,
          title: "Bilgewater",
          main: false,
        },
        {
          id: 7,
          title: "Blasphemous",
          main: false,
        },
        {
          id: 8,
          title: "bootstrap",
          main: false,
        },
        {
          id: 9,
          title: "Calzium",
          main: false,
        },
        {
          id: 10,
          title: "Casablanca",
          main: true,
        },
        {
          id: 11,
          title: "Constantine",
          main: false,
        },
        {
          id: 12,
          title: "Citizen Kane",
          main: true,
        },
      ],
      tree: [],
      loading: true,
    };
  },
  watch: {
    added() {
      this.createTree();
    },
    updated() {
      this.createTree();
    },
    deleted() {
      this.resetChildren();
      this.createTree();
    },
  },
  async created() {
    await this.fetchBrands();
    this.createTree();
  },
  mounted() {
    this.loading = false;
  },
  methods: {
    ...mapActions(["fetchBrands"]),
    createTree() {
      let lastFoundLetter = "";
      let sortedBrands = this.sortBrands(this.brands);
      let countItems = 0;

      sortedBrands.forEach((item) => {
        let firstLetter = item.title.substring(0, 1).toLowerCase();

        if (firstLetter !== lastFoundLetter) {
          Vue.set(this.tree, countItems, {
            id: Math.floor(Math.random() * 10000000),
            root: firstLetter.toLowerCase(),
            children: [],
          });
          countItems++;
        }

        this.tree.forEach((node) => {
          if (node.root === firstLetter) {
            node.children.push(item);
          }
        });

        lastFoundLetter = firstLetter;
      });
    },
    resetChildren() {
      this.tree.forEach((item) => (item.children = []));
    },
    sortBrands(brands) {
      return brands.sort((a, b) => a.title.localeCompare(b.title));
    },
  },
  computed: {
    brands() {
      return this.$store.state.brands;
    },
    added() {
      return this.$store.state.added;
    },
    updated() {
      return this.$store.state.updated;
    },
    deleted() {
      return this.$store.state.deleted;
    },
  },
  components: {
    TreeView,
    TheLoader,
  },
};
</script>

<style lang="scss">
@import "./assets/css/main.css";
</style>
