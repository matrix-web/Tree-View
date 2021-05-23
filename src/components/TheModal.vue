<template>
  <div
    class="modal-wrap"
    ref="modal"
    @click="close"
    :aria-hidden="[isOpen ? true : false]"
    :class="[isOpen ? 'open' : 'close']"
  >
    <div class="modal-overlay" data-close="true">
      <div class="modal-window" ref="modal" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h2 class="modal-title">{{ title }}</h2>
          <button class="modal-close" data-close="true">&times;</button>
        </header>
        <div class="modal-body" data-content>
          <p>{{ message }}</p>
        </div>
        <footer class="modal-footer">
          <button
            :class="buttonClassAction"
            class="mr-15"
            @click="$emit('modal-action')"
          >
            Удалить
          </button>
          <button :class="buttonClassCancel" data-close="true">Отмена</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  data: () => ({
    closing: false,
    destroyed: false,
    modal: null,
  }),
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
    },
    buttonClassAction: {
      type: String,
      default: "button button--danger",
    },
    buttonClassCancel: {
      type: String,
      default: "button button--secondary",
    },
  },
  watch: {
    isOpen(value) {
      if (value) {
        this.modal.closest("body").style.overflow = "hidden";
      } else {
        this.modal.closest("body").style.overflow = "auto";
      }
      return value;
    },
  },
  methods: {
    close(event) {
      const isElementClose = event.target.dataset.close;

      isElementClose && this.$emit("closed");
    },
  },
  mounted() {
    this.modal = this.$refs.modal;
  },
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  overflow: hidden;
}

.modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease-in, z-index 0.5s ease-in;
}

.modal-window {
  max-width: 600px;
  width: 90%;
  background-color: #fff;
  transition: transform 0.5s ease-in;
}

.modal-title {
  font-size: calc(1.125rem + 0.5vw);
  margin-right: 10px;
}

.modal-close {
  width: 25px;
  height: 25px;
  border: none;
  background-color: transparent;
}

.modal-wrap.open .modal-window {
  transform: translateY(0);
}

.modal-wrap.open .modal-overlay {
  z-index: 200;
  opacity: 1;
}

.modal-wrap.close .modal-overlay {
  opacity: 0;
}

.modal-wrap.close .modal-window {
  transform: translateY(-500px);
}
</style>
