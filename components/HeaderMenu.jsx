import Link from 'next/link'
import { useDispatch } from 'react-redux'
import categories from '../data/categories.json'
import { MENU_HIDE } from '../redux/types'

export default function HeaderMenu() {
  const dispatch = useDispatch()

  return (
    <div className='header-menu'>
      {categories?.map(category => (
        <div key={category.id} className='header-menu-category' onClick={() => dispatch({ type: MENU_HIDE })}>
          <Link href='/category/[slug]' as={`/category/${category.slug}`}>
            <a className='header-menu-link'>
              <span>{category.name?.toUpperCase()}</span>
            </a>
          </Link>
        </div>
      ))}
      <style jsx>{`
        .header-menu {
          display: flex;
          height: 100%;
          letter-spacing: 0.1rem;
          align-items: center;
          justify-content: space-between;
          color: #fff;
        }

        .header-menu-link span {
          position: relative;
        }

        .header-menu-link {
          padding: 2.25rem 0.5rem;
          display: block;
          font-weight: 500;
        }

        .header-menu-category {
          overflow-x: auto;
        }

        .header-menu-link span::before,
        .header-menu-link span::after {
          will-change: width;
          transition: width 0.4s ease;
          content: '';
          position: absolute;
          bottom: -0.25rem;
          width: 0%;
          height: 1px;
          background-color: #fff;
        }

        .header-menu-link:hover span::before,
        .header-menu-link:hover span::after {
          width: 50%;
        }

        .header-menu-link span::before {
          left: 50%;
        }

        .header-menu-link span::after {
          right: 50%;
        }

        @media (max-width: 1170px) {
          .header-menu {
            width: 100%;
          }
        }

        @media (max-width: 567px) {
          .header-menu {
            flex-direction: column;
            overflow-y: auto;
            background: #fafafa;
            color: #000;
            align-items: start;
            justify-content: start;
          }

          .header-menu-link {
            border-bottom: 2px solid #ebeef1;
            padding-left: 2rem;
          }

          .header-menu-link,
          .header-menu-category {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
