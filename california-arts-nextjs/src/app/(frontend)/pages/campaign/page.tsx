import Link from 'next/link'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getPageBySlug } from '@/lib/pages-data'

type CampaignImage = {
  href: string
  paddingTop: string
  src: string
  mobileSrc?: string
}

const campaignImages: CampaignImage[] = [
  {
    href: '/products/marmontdoublebreastedblazer?color=black',
    paddingTop: '50.276679841897234%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_952_b21b3b1a-a717-4815-b78c-2d69319965c3_2048x2048.png?v=1734233428',
    mobileSrc:
      'https://california-arts.com/cdn/shop/files/Asset_952_c66dd8ac-61eb-4cdb-a136-44f38f415658_2048x2048.png?v=1734233432',
  },
  {
    href: '/products/manhattanoversizedovercoat?color=chocolate-brown',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_956_2048x2048.png?v=1734232488',
  },
  {
    href: '/collections/coats-jackets',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_953_2048x2048.png?v=1734232404',
  },
  {
    href: '/collections/coats-jackets',
    paddingTop: '58.06831566548881%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_954_2048x2048.png?v=1734232431',
  },
  {
    href: '/products/hyperionleatherflightjacket?color=black',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_955_2048x2048.png?v=1734232469',
  },
  {
    href: '/products/marmontdoublebreastedblazer?color=smoke',
    paddingTop: '58.03886925795053%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_957_2048x2048.png?v=1734232554',
  },
  {
    href: '/products/paramountoversizedblazer?color=navy',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_961_2048x2048.png?v=1734232528',
  },
  {
    href: '/products/julianoversizedtrenchcoat?color=washed-black',
    paddingTop: '58.0559646539028%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_963_2048x2048.png?v=1734232689',
  },
  {
    href: '/collections/coats-jackets',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_958_2048x2048.png?v=1734232449',
  },
  {
    href: '/collections/na-accessories',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_959_2048x2048.png?v=1734232458',
  },
  {
    href: '/collections/coats-jackets',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_960_2048x2048.png?v=1734232511',
  },
  {
    href: '/products/hyperionleatherflightjacket?color=chocolate-brown',
    paddingTop: '57.00824499411071%',
    src: 'https://california-arts.com/cdn/shop/files/Asset_962_2048x2048.png?v=1734232695',
  },
]

function CampaignImageSection({ href, mobileSrc, paddingTop, src }: CampaignImage) {
  return (
    <div className="shopify-section has-full-screen-setting">
      <section>
        <div className="bg-primary-background border-t-grid border-transparent relative overflow-hidden h-auto">
          <Link href={href} prefetch={false} style={{ display: 'block' }}>
            <div className="h-full w-full">
              {mobileSrc ? (
                <>
                  <div className="hidden lg:block">
                    <ResponsiveCampaignImage paddingTop={paddingTop} src={src} />
                  </div>
                  <div className="lg:hidden">
                    <ResponsiveCampaignImage paddingTop={paddingTop} src={mobileSrc} />
                  </div>
                </>
              ) : (
                <ResponsiveCampaignImage paddingTop={paddingTop} src={src} />
              )}
            </div>

            <div className="absolute top-0 left-0 right-0 bottom-0 z-10 section-x-padding py-theme">
              <div className="w-full h-full flex justify-center items-center text-center">
                <div className="lg:w-2/3 text-primary-text" />
              </div>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}

function ResponsiveCampaignImage({ paddingTop, src }: { paddingTop: string; src: string }) {
  return (
    <div
      className="responsive-image-wrapper relative overflow-hidden w-full my-0 mx-auto"
      style={{ height: 0, paddingTop }}
    >
      <img
        alt=""
        className="responsive-image block absolute top-0 left-0 w-full h-full transition-opacity duration-200 ease-in-out max-w-full"
        src={src}
        style={{ objectFit: 'cover', opacity: 1 }}
      />
    </div>
  )
}

function RichTextSpacer() {
  return (
    <div className="shopify-section">
      <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
        <div className="px-8 lg:px-8 pb-4">
          <div className="flex text-base lg:text-3xl text-left justify-end">
            <div className="w-full lg:w-3/4">
              <div className="rte font-body break-words px-4">
                <p>
                  <br />
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function CampaignFallback() {
  return (
    <>
      <div className="shopify-section c_text-columns-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-b-grid border-grid-color">
          <div className="px-8 lg:px-8 py-2">
            <div className="multi-column col-gap-lg lg:col-count-3 space-y-2 text-left text-base lg:text-base">
              <div className="rte px-4 text-sm">
                <p>FW24 Creative Campaign: &quot;Corporate Holiday&quot;</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <CampaignImageSection {...campaignImages[0]} />
      <RichTextSpacer />
      {campaignImages.slice(1, 10).map((image) => (
        <CampaignImageSection key={image.src} {...image} />
      ))}

      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-base default text-left justify-end">
              <div className="w-full lg:w-3/4">
                <div className="rte font-body break-words px-4">
                  <p>
                    <br />
                    <em>
                      <strong>Credits</strong>
                    </em>
                    <br />
                    <em>Photography</em>{' '}
                    <a href="https://www.instagram.com/loganleemock/" rel="noreferrer" target="_blank">
                      Logan Mock
                      <br />
                    </a>
                    Grooming{' '}
                    <a href="https://www.instagram.com/zaheersyn/" rel="noreferrer" target="_blank">
                      Zaheer Sukhnandan
                    </a>
                    <br />
                    <em>Talent </em>
                    <a href="https://www.instagram.com/aashishrthakur/" rel="noreferrer" target="_blank">
                      Victor Ndigwe
                    </a>{' '}
                    &amp;{' '}
                    <a href="https://www.instagram.com/weregettingittogo/" rel="noreferrer" target="_blank">
                      Bret Fast
                    </a>
                    <br />
                    <em>Lighting</em>{' '}
                    <a href="https://www.instagram.com/steinology/" rel="noreferrer" target="_blank">
                      Bowas Yang
                      <br />
                    </a>
                    <em>Production</em>{' '}
                    <a href="https://www.instagram.com/heytyleraustin/" rel="noreferrer" target="_blank">
                      Amy Su
                      <br />
                    </a>
                    <em>Creative Direction</em>{' '}
                    <a href="https://www.instagram.com/g.tam/" rel="noreferrer" target="_blank">
                      Gary Tam
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {campaignImages.slice(10).map((image) => (
        <CampaignImageSection key={image.src} {...image} />
      ))}

      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-lg default text-right justify-center">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>
                    <br />
                    <br />
                    Discover the
                    <br />
                    Perennial Collection
                  </p>
                </div>
                <div className="mt-4 text-0 px-4">
                  <Link
                    className="inline-flex justify-center items-center text-base px-8 py-2 rounded-full bg-transparent text-primary-text border-text border-primary-text hover:border-primary-accent hover:text-primary-accent"
                    href="/collections/shop-all"
                    prefetch={false}
                  >
                    <span>Shop All</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <RichTextSpacer />
    </>
  )
}

export default async function CampaignPage() {
  const page = await getPageBySlug('campaign')

  return <CmsPageContent page={page} fallback={<CampaignFallback />} />
}
