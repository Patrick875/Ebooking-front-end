import Products from './Products'
import ProductSell from './ProductSell'
import ProductsAdd from './ProductsAdd'
import ProductEdit from './ProductEdit'
import ProductCategoryAdd from './ProductCategoryAdd'
import ProductCategories from './ProductCategories'
import ProductPackages from './ProductPackages'
import ProductPackageAdd from './ProductPackageAdd'

export const productRoutes = [
  {
    path: '/booking/products/all',
    exact: true,
    name: 'Product',
    element: Products,
  },

  {
    path: '/booking/products/sell',
    exact: true,
    name: 'Product',
    element: ProductSell,
  },
  {
    path: '/booking/products/add',
    exact: true,
    name: ' Add Product',
    element: ProductsAdd,
  },
  {
    path: '/booking/products/edit',
    exact: true,
    name: 'Product',
    element: ProductEdit,
  },
  {
    path: '/booking/products/categories/add',
    exact: true,
    name: 'Add Product Category',
    element: ProductCategoryAdd,
  },
  {
    path: '/booking/products/categories/all',
    exact: true,
    name: 'Product categgories',
    element: ProductCategories,
  },
  {
    path: '/booking/products/packages/all',
    exact: true,
    name: 'Product',
    element: ProductPackages,
  },
  {
    path: '/booking/products/packages/add',
    exact: true,
    name: 'Product',
    element: ProductPackageAdd,
  },
]
