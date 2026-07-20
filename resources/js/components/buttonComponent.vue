<template>
  <button :style="buttonStyle" @click="handleClick" :disabled="disabled">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: ['onClick', 'primary', 'secondary', 'cancel', 'disabled'],
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.onClick();
      }
    },
  },
  computed: {
    buttonStyle() {
      let backgroundColor = 'var(--grey)';
      let color = 'var(--dark-blue)';

      if (this.primary) {
        backgroundColor = 'var(--dark-blue)';
        color = 'var(--light-blue)';
      } else if (this.secondary) {
        backgroundColor = 'var(--light-blue)';
        color = 'var(--dark-blue)';
      } else if (this.cancel) {
        backgroundColor = 'var(--orange)';
        color = 'var(--dark-blue)';
      }

      if (this.disabled) {
        backgroundColor = 'var(--grey)';
        color = 'var(--dark-blue)';
        cursor = 'not-allowed';
      }

      return {
        backgroundColor,
        color,
        border: 'none',
        padding: '10px 20px',
        margin: '5px',
        borderRadius: '5px',
        cursor: this.disabled ? 'not-allowed' : 'pointer',
        fontWeight: 'bold',
      };
    },
  },
};
</script>