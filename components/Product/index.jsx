/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Image from 'next/image'
import { useRouter } from 'next/router'
import { memo, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import store from '../../redux/store'
import { CART_ADD, CART_SHOW, MODAL_SHOW, PRODUCT_UPDATE } from '../../redux/types'
import ProductInfo from './ProductInfo'

function Product({ product }) {
  const router = useRouter()

  //useEffect(() => {
  //  router.beforePopState(state => {
  //    console.log(window.scrollY)
  //    state.options.scroll = false
  //    return true
  //  })
  //}, [])

  //useEffect(() => {
  //  const listener = document.addEventListener('keydown', e => {
  //    if (e.key === 'Escape') {
  //      setModal({ type: 'HIDE_MODAL' })
  //    }

  //    if (e.key === 'Enter' && document.activeElement === inputCountRef.current) {
  //      setModal({ type: 'HIDE_MODAL' })
  //    }
  //  })

  //  return listener
  //}, [])

  const addToCart = data => {
    try {
      dispatch({ type: CART_ADD, payload: data })
    } catch (error) {
      console.error('something went wrong')
    } finally {
      dispatch({ type: CART_SHOW })
      dispatch({ type: MODAL_SHOW, payload: 'Product was added to the shopping cart.' })
    }
  }

  const dispatch = useDispatch()
  useEffect(() => dispatch({ type: PRODUCT_UPDATE, payload: { price: product.price, count: 1 } }), [])

  const submitHandler = useCallback(e => {
    e.preventDefault()

    const {
      product: { count, price, optionPrice, selected },
    } = store.getState()

    if (count === '' || count == undefined) {
      dispatch({ type: PRODUCT_UPDATE, payload: { count: 1 } })
    }

    //if (isCartVisible) return
    const totalPrice = price + optionPrice

    if (selected) {
      const data = {
        id: product.id,
        name: product.title,
        slug: product.slug,
        price: totalPrice,
        options: selected,
        count: count ? parseInt(count) : 1,
        image: product.image.url,
        Custom_Field: product.Custom_field,
      }

      if (data) {
        addToCart(data)
      }
    }
  }, [])

  return (
    <>
      <div className='product'>
        <div className='container'>
          <form action='' onSubmit={submitHandler}>
            <div className='product-header'>
              <div onClick={router.back} className='product-redirect'>
                <span>Go back</span>
              </div>
              <div className='product-title'>{product.title}</div>
            </div>
            <div className='product-inner'>
              <div className='product-image'>
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${product.image.url}`}
                  alt=''
                  width={product.image.width}
                  height={product.image.height}
                />
              </div>
              <ProductInfo
                info={{ Custom_field: product.Custom_field, price: product.price, description: product.description }}
              />
            </div>
          </form>
        </div>
      </div>
      <style jsx global>
        {`
          .header {
            background: transparent !important;
          }
        `}
      </style>
      <style jsx>{`
        .product {
          transition: transform 0.25s ease;
          color: #fff;
          background: transparent;
          padding: 0 0.5rem 10rem;
          position: relative;
          min-height: 100vh;
        }

        * {
          overflow: visible;
        }

        .product::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #111113;
          background-image: url(${process.env.NEXT_PUBLIC_API_URL}${product.image.url});
          background-repeat: repeat-x;
          background-size: 50%;
          background-position: top;
          z-index: -1;
          opacity: 0.15;
          filter: blur(2rem);
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        button {
          outline: none;
          background-color: transparent;
          padding: 2rem;
          border: none;
          cursor: pointer;
        }

        .product-inner {
          display: flex;
          gap: 2rem;
        }

        .product-title {
          font-size: 4rem;
          text-align: center;
          padding-bottom: 3rem;
        }

        .product-redirect {
          display: inline-block;
          cursor: pointer;
          padding: 1rem;
          position: relative;
        }

        .product-image {
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex: 1;
          min-width: 250px;
          z-index: 10;
        }

        .product-image::before {
          position: absolute;
          content: '';
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 25%;
          height: 25%;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.5;
          box-shadow: inset 0 0 50px #fff, /* inner white */ inset 20px 0 80px #fff,
            /* inner left magenta short */ inset -20px 0 80px #fff, /* inner right cyan short */ inset 20px 0 300px #fff,
            /* inner left magenta broad */ inset -20px 0 300px #fff, /* inner right cyan broad */ 0 0 50px #fff,
            /* outer white */ -10px 0 80px #fff, /* outer left magenta */ 10px 0 80px #fff; /* outer right cyan */
        }

        .product-redirect:hover {
          text-decoration: underline;
        }

        .product-redirect::before,
        .product-redirect::after {
          content: '';
          position: absolute;
          left: -0.75rem;
          width: 1.2rem;
          height: 1px;
          top: 50%;
          background-color: #fff;
        }
        .product-redirect::after {
          transform: rotate(45deg);
        }

        .product-redirect::before {
          transform: rotate(135deg);
        }

        .product-header {
          padding: 1rem 0;
          white-space: nowrap;
        }

        .container {
          margin: 0 auto;
          max-width: 91vw;
          padding: 0 1rem;
        }

        @media (max-width: 570px) {
          .product-title {
            padding: 0;
          }
        }
        @media (max-width: 567px) {
          .product-inner {
            flex-direction: column;
          }
          .product::after {
            background-repeat: repeat-y;
            background-size: 75%;
          }
        }
      `}</style>
    </>
  )
}

export default memo(Product)