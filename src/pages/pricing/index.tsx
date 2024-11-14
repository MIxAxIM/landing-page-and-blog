import Footer from "~/ui/landing/Footer";
import MenuBar from "~/ui/landing/MenuBar";
import { Elements } from '@stripe/react-stripe-js';
import { StripeElementsOptions, loadStripe } from '@stripe/stripe-js';

import { PaymentElement } from '@stripe/react-stripe-js';
import { api } from "~/utils/api";
import { Button } from "~/components/ui/button";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51QKjPpBylIiFyLIJoGgY2XwKEaLKwPQFGrG3bnG0P8clsS6kovjbrwY1OzIowKeHuT584m7zRGO2gCl0hDzFp3XI00ZekutEIa');

export default function PricingPage() {


  const options: StripeElementsOptions = {
    // passing the client secret obtained from the server
    mode: "payment",
    amount: 1099,
    currency: 'usd',
  };

  const { data } = api.billing.getPlans.useQuery()

  const { mutateAsync: initializeSubcription } = api.billing.createCheckoutSession.useMutation()

  const handleClick = async (priceId: string) => {
    try {
      const { url } = await initializeSubcription({
        priceId: priceId,
        successUrl: `${window.location.origin}/dashboard/subscription/success`,
        cancelUrl: `${window.location.origin}/cancel`,
      })
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      alert(error)
    }
  }


  return (


    <>
      <MenuBar />
      <main
        className="items-center justify-center"
        style={{ minHeight: "calc(100vh - 5rem)" }}
      >
        <div className="mx-auto max-w-7xl my-32">
          <h2 className="text-center text-2xl font-bold mb-24">
            Andamio Pricing
          </h2>
          <div className="grid grid-cols-3 gap-10">
            {data && data.map((d, i) => (
              <div key={i} className="p-5 rounded-md border border-black">
                <p>
                  {d.name}
                </p>
                <p>
                  Allowed Courses: {d.maxAllowedCourses}
                </p>
                <p>
                  Allowed Treasuries: {d.maxAllowedCourses}
                </p>
                {d.prices.map((p, j) => (
                  <div key={j}>
                    <p>
                      {(p.unitAmount / 100n).toString()} {p.currency}
                    </p>
                    <Button onClick={() => handleClick(p.id)}>
                      Buy Now
                    </Button>
                  </div>
                ))}
              </div>

            ))}
          </div>
          <Elements stripe={stripePromise} options={options} >
            <CheckoutForm />

          </Elements>
        </div>
      </main>
      <Footer />
    </>
  )
}



const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};


