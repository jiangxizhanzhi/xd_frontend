product --list ----index.vue ----components

    --add
    ----index.vue
    ----components

index --index.vue //布局信息 --components

{ name: 'product', path: '/product', children:[ { name: 'product-list', path: '', title: '产品管理', component: './pages/products/product-list.vue', }, { name: 'product-add', path: '/product/add', title: '新增产品', component: './pages/products/product-add.vue', }, { name: 'product-edit', path: '/edit', title: '编辑产品', component: './pages/products/product-edit', } ] }
