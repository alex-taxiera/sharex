import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Switch, Route } from 'react-router-dom'
import loadable from '@loadable/component'

import { Header } from '../components/header'
import { Footer } from '../components/footer'
const Home = loadable(() => import('../views/home'))
const Links = loadable(() => import('../views/links'))
const Pastes = loadable(() => import('../views/pastes'))
const Images = loadable(() => import('../views/images'))
const NotFound = loadable(() => import('../views/not-found'))

import manifest from '../../manifest.json'

import './index.scss'

export function App () {
  return (
    <>
      <MainSEO />
      <Header />
      <main className="container">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/images" component={Images} />
          <Route path="/links" component={Links} />
          <Route path="/pastes" component={Pastes} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </>
  )
}

function MainSEO () {
  return (
    <Helmet
      titleTemplate={`${manifest.short_name} | %s`}
      defaultTitle={manifest.short_name}
      htmlAttributes={{
        lang: 'en-US'
      }}
      link={[
        {
          rel: 'manifest',
          href: '/manifest.json'
        }
      ]}
      meta={[
        {
          property: 'og:site_name',
          content: manifest.name
        },
        {
          property: 'og:title',
          content: manifest.short_name
        },
        {
          name: 'description',
          content: manifest.description
        },
        {
          charset: 'utf-8'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:creator',
          content: 'Alex Taxiera'
        },
        {
          name: 'twitter:title',
          content: manifest.short_name
        },
        {
          name: 'twitter:description',
          content: manifest.description
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no'
        },
        {
          name: 'theme-color',
          content: manifest.theme_color
        },
        {
          name: 'description',
          content: manifest.description
        },
        {
          name: 'keywords',
          content: manifest.keywords.join(', ')
        }
      ]}
    />
  )
}
