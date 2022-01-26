import fetch from 'isomorphic-fetch'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Modal from '../../components/Modal'
import { useAuth } from '../../contexts/auth'

export default function Product({ product }) {
  const router = useRouter()
  const [selected, setSelected] = useState('')
  const [active] = useState(true)
  const [count, setCount] = useState(1)
  const [price] = useState(product.price)
  const [optionPrice, setOptionPrice] = useState(0)
  const { cartData, setCartData } = useAuth()
  const [showModal, setShowModal] = useState(false)

  function isDuplicate(arr, toCompare) {
    const convToNum = toConv => parseInt(toConv)
    const exists = arr.find(
      item => convToNum(item.id) === convToNum(toCompare.id) && item.options === toCompare.options
    )

    if (exists) return true
    return false
  }

  function submitHandler() {
    const totalPrice = price + optionPrice

    if (selected) {
      const data = {
        id: product.id,
        name: product.title,
        slug: product.slug,
        price: totalPrice,
        options: selected,
        count,
        image: product.image.url,
      }

      if (data && !isDuplicate(cartData, data)) {
        setCartData(prev => [...prev, data])
      } else {
        setShowModal(true)
      }
    }
  }

  function countHandler(e) {
    e.target.value <= 20 && e.target.value > 0 && setCount(e.target.value.replace(/\D/g, ''))
  }

  return (
    <>
      <Modal title={'Warning!'} show={showModal} onClose={() => setShowModal(false)}>
        Duplicate found
      </Modal>
      {/*<NextNProgress />*/}
      {product && (
        <div className='container'>
          <div className='product'>
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
              <div className='product-info'>
                <button type='button' className='product-info-price'>
                  {parseFloat(product.price + optionPrice)}
                </button>
                <p className='product-info-description'>{product.description}</p>
                {product.Custom_field.map(fld => {
                  const select = fld.options.split('|')

                  return (
                    <div key={fld.id} className='product-info-sizes'>
                      <div style={{ color: '#636573', fontWeight: '600' }}>{fld.title}:</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.75rem' }}>
                        {select.map(s => {
                          const price = parseFloat(s.match(/\[*(\d+.\d+)\]/)[1])
                          const option = s.replace(/ *\[[^\]]*]/, '').replace(/\[|\]/g, '')

                          if ((selected.trim().length === 0 && option.startsWith('S')) || option.startsWith('s')) {
                            setSelected(option)
                          }

                          return (
                            <input
                              type='button'
                              key={s}
                              className='product-info-sizes-input'
                              active={active && selected === option ? 'true' : 'false'}
                              value={option}
                              onClick={e => {
                                setSelected(e.target.value)
                                setOptionPrice(price)
                              }}
                            />
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
                <div className='product-info-count'>
                  <div className='product-info-count-title'>Count:</div>
                  <div className='product-info-count-counter'>
                    <button
                      className='product-info-count-counter-minus button-counter'
                      type='button'
                      onClick={() =>
                        setCount(prev => {
                          const value = prev - 1
                          if (value > 0) {
                            return value
                          } else {
                            return prev
                          }
                        })
                      }
                    >
                      <svg xmlns='http://www.w3.org/2000/svg'>
                        <path d='M9 4v1H0V4z'></path>
                      </svg>
                    </button>
                    <input type='text' value={count} className='product-info-count-input' onChange={countHandler} />
                    <button
                      className='product-info-count-counter-plus button-counter'
                      type='button'
                      onClick={() =>
                        setCount(prev => {
                          const value = prev + 1
                          if (value <= 20) {
                            return value
                          } else {
                            return prev
                          }
                        })
                      }
                    >
                      <svg xmlns='http://www.w3.org/2000/svg'>
                        <path d='M9 4H5V0H4v4H0v1h4v4h1V5h4z'></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <button type='button' className='product-info-add-to-cart' onClick={submitHandler}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        body {
          background-color: #1d1f21;
          color: #1d1f21;
          transition: all 0.5s ease;
        }
        body {
          color: #fff;
        }
      `}</style>

      <style jsx>{`
        .product {
          padding: 0.5rem;
        }

        .product-info {
          flex: 1;
        }

        .button-counter svg {
          width: 0.6rem;
          height: 0.6rem;
        }

        .button-counter:active {
        }

        @media (max-width: 870px) {
        }

        @media (max-width: 460px) {
          .product-info-description {
            line-height: 1.5;
          }

          .product {
            padding: 0.75rem 0 !important;
          }

          .container {
            padding: 0.6rem !important;
          }
        }

        .product-info-add-to-cart {
          font-size: 0.9rem;
          transition: all 0.2s ease;
          background-color: #fff;
          letter-spacing: 2px;
          text-transform: uppercase;
          border-radius: 3rem;
          font-weight: 600;
        }

        .product-info-add-to-cart:active {
          transform: scale(1.09);
        }

        .product-info-add-to-cart:hover {
          filter: brightness(80%);
        }

        .product-info-count-counter {
          display: flex;
          max-width: fit-content;
          border-radius: 3rem;
          border: 2px solid #fff;
        }

        .product-info-count-title {
          color: #636573;
          padding: 0.5rem 0;
          font-weight: 600;
        }

        .product-info-count {
          display: inline-block;
        }

        .product-info-count-input {
          width: 3.5rem;
          text-align: center;
          font-weight: 600;
          outline: none;
          border: none;
          font-size: 0.9rem;
        }

        .product-info-count {
          margin: 1rem 1rem 1rem 0;
        }

        button {
          outline: none;
          background-color: transparent;
          padding: 1.2rem;
          border: none;
          cursor: pointer;
        }

        svg {
          fill: #fff;
          height: 9px;
          width: 9px;
        }

        .product-info-sizes-input[active='true'] {
          background-color: #fff;
          color: #000;
        }

        .product-info-sizes-input {
          color: #797b8c;
          transition: all 0.2s ease;
          transition-property: color, background-color, transform;
          cursor: pointer;
          border-style: none;
          background: #474852;
          border-radius: 3rem;
          padding: 0.75rem 1.2rem;
          margin-right: 0.25rem;
          font-size: 0.8rem;
        }

        .product-info-sizes-input:active {
          transform: scale(1.15);
        }

        .product-info-sizes-input:last-child {
          margin-right: 0;
        }

        .product-info-description {
          font-size: 1rem;
          min-width: 225px;
          word-break: break-word;
        }

        .product-info-sizes {
          padding: 0.75rem 0;
        }

        .product-inner {
          display: flex;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .product-info {
          flex: 1;
        }

        .product-info-price {
          background-color: #fff;
          color: #1d1f21;
          padding: 0.75rem 3rem;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 3rem;
          max-width: fit-content;
          border: none;
          white-space: nowrap;
          cursor: default;
        }

        .product-title {
          font-size: 2rem;
          text-align: center;
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
        }

        .product-redirect:hover {
          text-decoration: underline;
        }

        .product-redirect::before,
        .product-redirect::after {
          content: '';
          position: absolute;
          left: 0;
          width: 0.6rem;
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
      `}</style>
    </>
  )
}

export async function getServerSideProps(context) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${context.params.slug}`)
  const data = await res.json()

  return {
    props: {
      product: data,
    },
  }
}