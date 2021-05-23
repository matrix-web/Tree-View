<template>
  <li
    class="tree-view-nodes__item"
    @mouseenter="toggleShowActions"
    @mouseleave="toggleShowActions"
  >
    <div class="tree-view-nodes__item-update" v-if="isUpdate">
      <div class="tree-view-nodes__item-field-group">
        <input
          v-model.trim="updatedTitle"
          class="input-field tree-view-nodes__item-field"
          type="text"
          :class="{ 'input-field--invalid': !required && dirty }"
          @input="fieldRequired(updatedTitle)"
          @focus="dirty = true"
          @blur="dirty = false"
        />
        <p
          class="invalid mt-5 mr-10"
          v-if="!required && dirty && !updatedTitle.length"
        >
          Поле обязательно для заполнения
        </p>
        <div class="tree-view-nodes__item-update-buttons">
          <TreeViewButton
            @click.native="update"
            class="tree-view__action-button"
          >
            <i class="fas fa-check"></i>
          </TreeViewButton>
          <TreeViewButton
            @click.native="updateCancel"
            class="tree-view__action-button"
          >
            <i class="fas fa-times"></i>
          </TreeViewButton>
        </div>
      </div>
    </div>
    <template v-else>
      <span class="tree-view-nodes__item-text">{{ node.title }}</span>
      <transition
        enter-active-class="duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opaicty-100"
        leave-active-class="duration-75"
        leave-from-class="opacity-100"
        leave-to-class="opaicty-0"
      >
        <div class="tree-view__action" v-show="isShown">
          <TreeViewButton
            @click.native="isUpdate = true"
            class="tree-view__action-button"
          >
            <i class="far fa-edit"></i>
          </TreeViewButton>
          <TreeViewButton
            @click.native="openModal"
            class="tree-view__action-button"
          >
            <i class="far fa-trash-alt"></i>
          </TreeViewButton>
        </div>
      </transition>
      <TheModal
        :isOpen="modalIsOpen"
        :title="'Вы уверены?'"
        :message="`Хотите удалить? Элемент ${node.title}`"
        @closed="modalIsOpen = false"
        @modal-action="deleteItem"
      />
    </template>
  </li>
</template>

<script>
import { mapActions } from "vuex";
import TreeViewButton from "@/components/TreeViewButton";
import TheModal from "@/components/TheModal";

export default {
  data() {
    return {
      isShown: false,
      isUpdate: false,
      modalIsOpen: false,
      required: false,
      dirty: false,
      updatedTitle: this.node.title,
      updatedItem: {},
    };
  },
  methods: {
    ...mapActions(["updateBrand", "deleteBrand"]),
    toggleShowActions() {
      this.isShown = !this.isShown;
    },
    async update() {
      if (this.required) {
        this.updatedItem = {
          ...this.node,
          title: this.updatedTitle,
        };

        await this.updateBrand(this.updatedItem);

        if (this.$store.state.updated) {
          this.isUpdate = false;
          this.isShown = false;
          this.$message("Элемент успешно обновлен!");

          this.$nextTick(() => {
            this.$store.commit("setUpdated", false);
          });
        }
      }
    },
    openModal() {
      this.modalIsOpen = true;
    },
    async deleteItem() {
      this.modalIsOpen = false;
      await this.deleteBrand(this.node._id);

      if (this.$store.state.deleted) {
        this.$message("Элемент успешно удален!");

        this.$nextTick(() => {
          this.$store.commit("setDeleted", false);
        });
      }
    },
    updateCancel() {
      this.isUpdate = false;
      this.updatedTitle = this.node.title;
    },
    fieldRequired(value) {
      this.required = !!value;
    },
  },
  components: {
    TreeViewButton,
    TheModal,
  },
  props: {
    node: {
      type: Object,
    },
  },
};
</script>
