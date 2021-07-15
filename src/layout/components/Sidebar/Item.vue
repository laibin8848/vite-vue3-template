<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MenuItem',
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup() {
  }
});
</script>
