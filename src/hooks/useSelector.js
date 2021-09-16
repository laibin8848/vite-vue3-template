import { ref } from 'vue';

export default function useSelector() {
  const selectorVisable = ref(false)
  const selectorMode = ref('')

  const showSelector = (mode = '') => {
    selectorMode.value = mode
    selectorVisable.value = true
  }

  return {
    selectorVisable,
    showSelector,
    selectorMode
  }
}
