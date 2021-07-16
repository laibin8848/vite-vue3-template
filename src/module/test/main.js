import Test from '@/module/test/views/Test.vue'

export default {
  routes: [
    {
      path: '/test',
      name: 'test',
      meta: {hidden: false, title: 'test',},
      component: Test,
      children: []
    }
  ]
}
