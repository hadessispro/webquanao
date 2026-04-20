import Link from 'next/link'
import CmsPageContent from '@/components/page/CmsPageContent'
import { getPageBySlug } from '@/lib/pages-data'

function AboutFallback() {
  return (
    <>
      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-2xl lg:text-5xl text-left justify-start">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>
                    <br />
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-xl default text-left justify-start">
              <div className="w-full lg:w-full">
                <h2 className="font-body mb-4 px-4 text-xl">Customer Care</h2>
                <div className="rte mb-4 font-body break-words px-4">
                  <p>
                    <br />
                    For questions about shipping,
                    <br />
                    returns and exchanges, please
                    <br />
                    visit our{' '}
                    <Link href="/pages/returns-exchanges">shipping and returns</Link>
                    <br />
                    page.
                  </p>
                  <p>
                    <br />
                    For accessibility, questions,
                    <br />
                    feedback and all other
                    <br />
                    inquiries, email us at
                    <br />
                    <strong>clientservices@california-arts.com</strong>.
                  </p>
                  <p>
                    <br />
                    Thank you visiting California
                    <br />
                    Arts&trade;.
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="shopify-section">
        <section className="bg-primary-background text-primary-text overflow-hidden border-t-grid border-transparent">
          <div className="px-8 lg:px-8 pb-4">
            <div className="flex text-sm default text-right justify-start">
              <div className="w-full lg:w-full">
                <div className="rte font-body break-words px-4">
                  <p>
                    &quot;Good design makes a product useful.&quot;
                    <br />
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default async function AboutPage() {
  const page = await getPageBySlug('about')

  return <CmsPageContent page={page} fallback={<AboutFallback />} />
}
