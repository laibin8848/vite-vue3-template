import Test from '@/module/test/views/Test.vue'

export default {
  MN: 'test',
  BR: '/test',
  icon: 'el-icon-folder',
  routes: [
    {
      path: '/test',
      name: 'test',
      meta: {hidden: false, title: 'test',},
      component: Test,
      children: []
    },
    {
      path: '/test/page1',
      name: 'testo',
      meta: {hidden: false, title: 'page1',},
      component: Test,
      children: []
    }
  ]
}
