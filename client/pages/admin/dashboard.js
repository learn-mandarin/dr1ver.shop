import axios from '../../axios/config'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/Auth.context'

export default function AdminDashboard(req, res) {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState([])
  const [productKeys, setProductKeys] = useState([])
  const { auth } = useAuth()

  async function submitHandler(e) {
    e.preventDefault()
  }

  async function getProducts() {
    await axios.get('/api/products').then(res => {
      setProducts(res.data)
      setProductKeys(Object.keys(res.data[0]))
    })
  }

  function inputHandler(e) {}

  useEffect(() => {
    console.log(products)
  }, [products])

  useEffect(() => {
    if (auth?.user?.userTypeId === 1) {
      setMounted(true)
    }
  }, [auth])

  useEffect(() => {
    if (mounted) getProducts()
  }, [mounted])

  return mounted ? (
    <div className='container'>
      <form onSubmit={submitHandler}>
        <table className='table'>
          <thead>
            <tr>
              {products[0] &&
                productKeys.map(item => {
                  return <td key={item}>{item}</td>
                })}
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map(item => {
                return (
                  <tr key={item.product_id}>
                    {Object.values(item).map((data, index) => {
                      return (
                        <td key={data}>
                          <input
                            key={data}
                            value={data}
                            name={productKeys[index]}
                            onChange={inputHandler}
                          />
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
          </tbody>
        </table>
        <style jsx>
          {`
            .table {
              width: 100%;

              margin-bottom: 20px;

              border: 1px solid #dddddd;

              border-collapse: collapse;
            }

            .table th {
              font-weight: bold;

              padding: 5px;

              background: #efefef;

              border: 1px solid #dddddd;
            }

            .table td {
              border: 1px solid #dddddd;

              padding: 5px;
            }
          `}
        </style>
      </form>
    </div>
  ) : null
}