import Test from '@/module/test/views/Test.vue'

export default {
  routes: [
    {
      path: '/test2',
      name: 'test2',
      meta: {hidden: false, title: 'test2',},
      component: Test,
      children: []
    }
  ]
}
