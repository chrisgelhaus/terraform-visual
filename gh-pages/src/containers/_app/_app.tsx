import { Navbar } from '@app/containers/_app'
import styles from '@app/containers/_app/app.module.css'
import { TerraformPlanProvider } from '@app/context/terraform-plan'
import { ReactGa } from '@app/utils/google-analytics'
import Head from 'next/head'
import { Router } from 'next/router'
import { useEffect } from 'react'

export const C = ({ Component, pageProps }: any) => {
  const title = 'Terraform Visual'

  useEffect(() => {
    ReactGa.set({ page: window.location.pathname })
    ReactGa.pageview(window.location.pathname)

    Router.events.on('routeChangeComplete', () => {
      ReactGa.set({ page: window.location.pathname })
      ReactGa.pageview(window.location.pathname)
    })
  }, [])

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
        <meta
          name="google-site-verification"
          content="uP7DvoPqGNsHxvkVhK8aI0zizIHipI0LhZUueqfbG8Y"
        />
      </Head>

      <TerraformPlanProvider>
        <Navbar.C />

        <div className={styles.container}>
          <Component {...pageProps} />
        </div>
      </TerraformPlanProvider>
    </>
  )
}
