import animate from "./anime.js";

export default class Toast {
  constructor(options) {
    Toast.defaultsSettings = {
      contentHTML: "",
      displayDuration: 4000,
      inDuration: 300,
      outDuration: 400,
      classes: "",
      completeCollback: null,
      activationPercent: 0.8,
    };
    this.options = Object.assign(Toast.defaultsSettings, options);
    this.message = this.options.contentHTML;
    this.panning;
    false;
    this.timeRemaining = this.options.displayDuration;

    if (Toast.toasts.length === 0) {
      Toast.createContainer();
    }

    Toast.toasts.push(this);
    const toastElement = this.createToast();
    toastElement.My_Toast = this;
    this.el = toastElement;

    this.setTimer();
    this.animateIn();
  }

  static toasts = [];
  static container = null;
  static draggedToast = null;

  static xPos(event) {
    if (event.targetTouches && event.targetTouches.length >= 1) {
      return event.targetTouches[0].clientX;
    }

    return event.clientX;
  }

  static getInstance(el) {
    let domElem = el.jquery ? el[0] : el;
    return domElem.M_Toast;
  }

  static createContainer() {
    const container = document.createElement("div");
    container.classList.add("toast-container");
    container.setAttribute("id", "toast-container");

    container.addEventListener("touchstart", Toast.onDragStart);
    container.addEventListener("touchmove", Toast.onDragMove);
    container.addEventListener("touchend", Toast.onDragEnd);

    container.addEventListener("mousedown", Toast.onDragStart);
    document.addEventListener("mousemove", Toast.onDragMove);
    document.addEventListener("mouseup", Toast.onDragEnd);

    document.body.append(container);
    Toast.container = container;
  }

  static onDragStart(event) {
    if (event.target) {
      const $toast = event.target;
      const toast = Toast.toasts[0].el.My_Toast;
      toast.panning = true;
      Toast.draggedToast = toast;
      toast.el.classList.add("panning");
      toast.el.style.transition = "";
      toast.startingXPos = Toast.xPos(event);
      toast.time = Date.now();
      toast.xPos = Toast.xPos(event);
    }
  }

  static onDragMove(event) {
    if (Toast.draggedToast) {
      event.preventDefault();
      const toast = Toast.draggedToast;
      toast.deltaX = Math.abs(toast.xPos - Toast.xPos(event));
      toast.xPos = Toast.xPos(event);
      toast.velocityX = toast.deltaX / (Date.now() / toast.time);
      toast.time = Date.now();

      const totalDeltaX = toast.xPos - toast.startingXPos;
      const activationDistance =
        toast.el.offsetWidth * toast.options.activationPercent;
      toast.el.style.transform = `translateX(${totalDeltaX}px)`;
      toast.el.style.opacity = 1 - Math.abs(totalDeltaX / activationDistance);
    }
  }

  static onDragEnd() {
    if (Toast.draggedToast) {
      const toast = Toast.draggedToast;
      toast.panning = false;
      toast.el.classList.remove("panning");

      const totalDeltaX = toast.xPos - toast.startingXPos;
      const activationDistance =
        toast.el.offsetWidth * toast.options.activationPercent;
      const shouldBeDismiss =
        Math.abs(totalDeltaX) > activationDistance || toast.velocityX > 1;

      if (shouldBeDismiss) {
        toast.wasSwiped = true;
        toast.removeToast();
      } else {
        toast.el.style.transition = "transform .2s, opacity .2s";
        toast.el.style.transform = "";
        toast.el.style.opacity = "";
      }

      Toast.draggedToast = null;
    }
  }

  static removeAll() {
    for (let toastIndex in Toast.toasts) {
      Toast.toasts[toastIndex].removeToast();
    }
  }

  static removeContainer() {
    document.removeEventListener("mousemove", Toast.onDragMove);
    document.removeEventListener("mouseup", Toast.onDragEnd);

    Toast.container.remove();
    Toast.container = null;
  }

  setTimer() {
    if (this.timeRemaining !== Infinity) {
      this.counterInterval = setInterval(() => {
        if (!this.panning) {
          this.timeRemaining -= 20;
        }

        if (this.timeRemaining <= 0) {
          this.removeToast();
        }
      }, 20);
    }
  }

  animateIn() {
    animate({
      targets: this.el,
      top: 0,
      opacity: 1,
      duration: this.options.inDuration,
      easing: "easeOutCubic",
    });
  }

  removeToast() {
    window.clearInterval(this.counterInterval);
    const activationDistance =
      this.el.offsetWidth * this.options.activationPercent;

    if (this.wasSwiped) {
      this.el.style.transition = `transform .05s, opacity .05s`;
      this.el.style.transform = `translate(${activationDistance}px)`;
      this.el.style.opacity = 0;
    }

    animate({
      targets: this.el,
      opacity: 0,
      marginTop: -40,
      duration: this.options.outDuration,
      easing: "easeOutExpo",
      complete: () => {
        if (typeof this.options.completeCallback === "function") {
          this.options.completeCallback();
        }

        this.el.remove();
        Toast.toasts.splice(Toast.toasts.indexOf(this), 1);
        if (Toast.toasts.length === 0) {
          Toast.removeContainer();
        }
      },
    });
  }

  createToast() {
    const toast = document.createElement("div");
    toast.classList.add("toast");

    if (this.options.classes.length) {
      toast.classList.add(this.options.classes);
    }

    if (
      typeof HTMLElement === "object"
        ? this.message instanceof HTMLElement
        : typeof this.message === "object" &&
          this.message !== null &&
          this.message.nodeType === 1 &&
          typeof this.message.nodeName === "string"
    ) {
      toast.append(this.message);
    } else {
      toast.innerHTML = this.message;
    }

    Toast.container.append(toast);

    return toast;
  }
}
