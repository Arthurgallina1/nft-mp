import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useWeb3Context } from '../context/web3context'
import Button from './Button'
import Modal from './Modal'

type NavItemType = {
  name: string
  path: string
}

const NAV_ITEMS: NavItemType[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Mint Tokens',
    path: '/mint-item',
  },
  {
    name: 'My NFTs',
    path: '/my-nfts',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Tokens',
    path: '/tk-token',
  },
  {
    name: 'Toolkit',
    path: '/toolkit',
  },
]

const activeClassName =
  'bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium'
const inactiveClassName =
  'text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'

export default function Navbar() {
  const { pathname } = useRouter()
  const { connectWallet, loggedAddress } = useWeb3Context()

  return (
    <>
      <Head>
        <title>Flow MarketPlace</title>
        <meta name='description' content='NFT Marketplace' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <nav className='bg-gray-800'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='relative flex items-center justify-between h-16'>
            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'></div>
            <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex-shrink-0 flex items-center'>
                <img
                  className='block lg:hidden h-8 w-auto'
                  src='https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg'
                  alt='Workflow'
                />
                <img
                  className='hidden lg:block h-8 w-auto'
                  src='https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg'
                  alt='Workflow'
                />
              </div>
              <div className='hidden sm:block sm:ml-6'>
                <div className='flex space-x-4'>
                  {NAV_ITEMS.map((navItem) => (
                    <span
                      key={navItem.path}
                      className={
                        pathname === navItem.path
                          ? activeClassName
                          : inactiveClassName
                      }
                    >
                      <Link href={navItem.path}>{navItem.name}</Link>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {loggedAddress ? (
              <div className='hidden sm:block'>
                <span className='text-white'>{loggedAddress}</span>
              </div>
            ) : (
              <>
                <Button onClick={connectWallet}>Connect</Button>
              </>
            )}
          </div>
        </div>

        <div className='sm:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {NAV_ITEMS.map((navItem) => (
              <span
                key={navItem.path}
                className={
                  pathname === navItem.path
                    ? activeClassName
                    : inactiveClassName
                }
              >
                <Link href={navItem.path}>{navItem.name}</Link>
              </span>
            ))}
          </div>
        </div>
      </nav>
    </>
  )
}
