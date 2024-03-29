/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import { memo, useEffect, useState } from 'react'
import filterFields from '../../functions/product/filterFields'
import { getProduct } from '../../pages/api/product'
import ProductProvider from '../../providers/ProductProvider'
import ProductRecommended from '../ProductRecommended'
import Product from './Product'

function ProductPage({ slug }) {
  const [productData, setProductData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })

    getProduct(slug).then(data => {
      setProductData(filterFields(data))
      setLoading(false)
    })
  }, [])

  return (
    <div className='product-wrapper'>
      <ProductProvider type={'product'}>
        <Product product={productData.product} loading={loading} />
      </ProductProvider>
      {!loading && <ProductRecommended categories={productData.categories} productSlug={productData.product.slug} />}
      <style jsx>{`
        .product-wrapper {
          position: relative;
          min-height: 100vh;
        }
      `}</style>

      <style jsx global>
        {`
          .header {
            background: transparent !important;
          }

          body {
            transition: background 1s ease;
            background: #111113;
          }
        `}
      </style>
    </div>
  )
}

export default memo(ProductPage)
