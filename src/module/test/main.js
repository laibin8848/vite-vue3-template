import Test from '@/module/test/views/Test.vue'

export default {
<<<<<<< HEAD
  MN: 'test',
  BR: '/test',
  icon: 'el-icon-folder',
=======
>>>>>>> cadfe8d9eef7ce2bb6ff5fa68f9a941a4806d265
  routes: [
    {
      path: '/test',
      name: 'test',
      meta: {hidden: false, title: 'test',},
      component: Test,
      children: []
<<<<<<< HEAD
    },
    {
      path: '/test/page1',
      name: 'testo',
      meta: {hidden: false, title: 'page1',},
      component: Test,
      children: []
=======
>>>>>>> cadfe8d9eef7ce2bb6ff5fa68f9a941a4806d265
    }
  ]
}
