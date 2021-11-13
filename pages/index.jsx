import React from 'react'
import Product from '../components/Product'
import api from '../config/api'

function Home({ products }) {
  return (
    <React.Fragment>
      <div style={{ textAlign: 'center', fontSize: '2rem', padding: '2rem 0' }}>All cards</div>
      <Product products={products} />
    </React.Fragment>
  )
}

export const getStaticProps = async ctx => {
  const response = await api.get('/products').then(res => res.data)

  return {
    props: {
      products: response,
    },
  }
}

export default Home
