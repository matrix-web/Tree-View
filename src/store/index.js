import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    brands: [],
    updated: false,
    deleted: false,
    added: false,
  },
  mutations: {
    setBrands(state, brands) {
      state.brands = brands;
    },
    setUpdated(state, value) {
      state.updated = value;
    },
    setDeleted(state, value) {
      state.deleted = value;
    },
    setAdded(state, value) {
      state.added = value;
    },
  },
  actions: {
    async fetchBrands({ commit }) {
      try {
        const response = await fetch(
          "https://recruting-test-api.herokuapp.com/api/v1/brands"
        );
        const data = await response.json();

        commit("setBrands", data);
      } catch (err) {
        throw new Error(err);
      }
    },
    async addBrand({ commit, dispatch }, data) {
      try {
        const response = await fetch(
          "https://recruting-test-api.herokuapp.com/api/v1/brands",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.status === 201) {
          await dispatch("fetchBrands");
          commit("setAdded", true);
        } else {
          commit("setAdded", false);
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteBrand({ commit, dispatch }, id) {
      try {
        const response = await fetch(
          `https://recruting-test-api.herokuapp.com/api/v1/brand/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.status === 204) {
          await dispatch("fetchBrands");
          commit("setDeleted", true);
        } else {
          commit("setDeleted", false);
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async updateBrand({ commit, dispatch }, data) {
      try {
        const response = await fetch(
          `https://recruting-test-api.herokuapp.com/api/v1/brand/${data._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();
        await dispatch("fetchBrands");

        if (result) {
          commit("setUpdated", true);
        } else {
          commit("setUpdated", false);
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  },
  modules: {},
});
