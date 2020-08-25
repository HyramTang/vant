import { createNamespace } from '../utils';
import { FieldMixin } from '../mixins/field';
import { CheckboxMixin } from '../mixins/checkbox';

const [createComponent, bem] = createNamespace('checkbox');

export default createComponent({
  mixins: [
    FieldMixin,
    CheckboxMixin({
      bem,
      role: 'checkbox',
      parent: 'vanCheckbox',
    }),
  ],

  emits: ['click', 'change', 'update:modelValue'],

  computed: {
    checked: {
      get() {
        if (this.parent) {
          return this.parent.modelValue.indexOf(this.name) !== -1;
        }
        return this.modelValue;
      },

      set(val) {
        if (this.parent) {
          this.setParentValue(val);
        } else {
          this.$emit('update:modelValue', val);
        }
      },
    },
  },

  watch: {
    modelValue(val) {
      this.$emit('change', val);
    },
  },

  methods: {
    // @exposed-api
    toggle(checked = !this.checked) {
      // When toggle method is called multiple times at the same time,
      // only the last call is valid.
      // This is a hack for usage inside Cell.
      clearTimeout(this.toggleTask);
      this.toggleTask = setTimeout(() => {
        this.checked = checked;
      });
    },

    setParentValue(val) {
      const { parent } = this;
      const value = parent.modelValue.slice();

      if (val) {
        if (parent.max && value.length >= parent.max) {
          return;
        }

        /* istanbul ignore else */
        if (value.indexOf(this.name) === -1) {
          value.push(this.name);
          parent.$emit('update:modelValue', value);
        }
      } else {
        const index = value.indexOf(this.name);

        /* istanbul ignore else */
        if (index !== -1) {
          value.splice(index, 1);
          parent.$emit('update:modelValue', value);
        }
      }
    },
  },
});